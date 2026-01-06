const GLOBAL_PORT_KEY = '__HIKAZE_API_PORT__'
const GLOBAL_BASE_KEY = '__HIKAZE_API_BASE__'
const GLOBAL_EMBEDDED_KEY = '__HIKAZE_EMBEDDED__'

type SnifferResponse = { port?: number }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function getGlobalValue(key: string): unknown {
  return (globalThis as any)[key]
}

function setGlobalValue(key: string, value: unknown): void {
  ;(globalThis as any)[key] = value
}

export function isEmbedded(): boolean {
  return Boolean(getGlobalValue(GLOBAL_EMBEDDED_KEY))
}

export function initSnifferGlobals(): void {
  if (typeof getGlobalValue(GLOBAL_PORT_KEY) !== 'number') {
    setGlobalValue(GLOBAL_PORT_KEY, 0)
  }
  if (typeof getGlobalValue(GLOBAL_BASE_KEY) !== 'string') {
    setGlobalValue(GLOBAL_BASE_KEY, '')
  }
}

function getGlobalPort(): number {
  const raw = getGlobalValue(GLOBAL_PORT_KEY)
  const port = Number(raw ?? 0)
  return Number.isFinite(port) ? port : 0
}

function setGlobalPort(port: number): void {
  setGlobalValue(GLOBAL_PORT_KEY, port)
}

function getBaseOverride(): string {
  const raw = getGlobalValue(GLOBAL_BASE_KEY)
  return typeof raw === 'string' ? raw : ''
}

async function fetchSnifferPort(): Promise<number> {
  try {
    const response = await fetch('/api/hikaze/sniffer_port', { cache: 'no-store' })
    if (!response.ok) {
      return 0
    }
    const data = (await response.json()) as SnifferResponse
    const port = Number(data?.port ?? 0)
    return Number.isFinite(port) ? port : 0
  } catch {
    return 0
  }
}

let pendingPortPromise: Promise<number> | null = null

async function pollSnifferPort(): Promise<number> {
  while (true) {
    const port = await fetchSnifferPort()
    if (port > 0) {
      setGlobalPort(port)
      return port
    }
    await sleep(1000)
  }
}

export function primeSnifferPort(): void {
  if (!isEmbedded()) {
    return
  }
  if (!pendingPortPromise) {
    pendingPortPromise = pollSnifferPort()
  }
}

export async function ensureSnifferPort(): Promise<number> {
  if (!isEmbedded()) {
    return 0
  }
  const current = getGlobalPort()
  if (current > 0) {
    return current
  }
  if (!pendingPortPromise) {
    pendingPortPromise = pollSnifferPort()
  }
  return pendingPortPromise
}

export function getApiBaseSync(): string {
  const override = getBaseOverride()
  if (override) {
    return override
  }
  if (!isEmbedded()) {
    return ''
  }
  const port = getGlobalPort()
  if (!port) {
    return ''
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'
  return `http://${hostname}:${port}`
}

export async function getApiBase(): Promise<string> {
  const base = getApiBaseSync()
  if (base) {
    return base
  }
  const port = await ensureSnifferPort()
  if (!port) {
    return ''
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'
  return `http://${hostname}:${port}`
}

export async function buildApiUrl(path: string): Promise<string> {
  const base = await getApiBase()
  return base ? `${base}${path}` : path
}
