import { ref } from 'vue'

import HikazeCheckpointLoaderOverlay from '../../components/HikazeCheckpointLoaderOverlay.vue'
import type { InjectionContext, NodeBodyOverlayDefinition } from '../types'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

/**
 * Controller for `HikazeCheckpointLoader` node.
 *
 * Behavior:
 * - VueNodes mode: cover the node body with a custom overlay shell.
 * - Legacy mode: hook the text widget click to open the prompt.
 */
const NODE_TYPE = 'HikazeCheckpointLoader'
const CKPT_WIDGET = 'ckpt_path'

export class HikazeCheckpointLoaderController extends BaseHikazeNodeController {
  /** Reactive copy of widget value used by the overlay component. */
  private readonly ckptPathRef = ref<string>('')

  /** Stored original handler so we can restore it on dispose. */
  private onWidgetChangedOriginal: any = null
  /** Wrapper handler that syncs `ckptPathRef` then delegates to original. */
  private onWidgetChangedWrapper: any = null

  /** Hydration sync timers for VueNodes mode. */
  private hydrationSyncTimers: number[] = []

  /** Inject lifecycle: hook widget changes, sync initial value, then mount overlays. */
  override inject(ctx: InjectionContext) {
    this.ensureWidgetChangeHook()
    this.syncFromWidget()
    this.scheduleHydrationSync(ctx)
    super.inject(ctx)
  }

  /** Dispose lifecycle: unhook widget changes and let base class cleanup overlays. */
  override dispose() {
    this.clearHydrationSync()
    this.unhookWidgetChange()
    super.dispose()
  }

  /** VueNodes mode: provide a body overlay that captures click. */
  protected override getVueBodyOverlays(
    _ctx: InjectionContext
  ): NodeBodyOverlayDefinition[] {
    return [
      {
        key: 'hikaze-checkpoint-loader',
        title: 'Hikaze Checkpoint Loader',
        cursor: 'default',
        pointerEvents: 'auto',
        component: HikazeCheckpointLoaderOverlay,
        props: () => ({
          nodeId: this.node?.id ?? null,
          ckptPathRef: this.ckptPathRef,
          commitPath: (next: string) => this.commitPath(next)
        })
      }
    ]
  }

  /** Legacy mode: patch the widget click handler. */
  protected override onInjectLegacy(_ctx: InjectionContext) {
    this.hookLegacyTextWidgetClick(CKPT_WIDGET, (current) =>
      window.prompt('Enter absolute checkpoint path', current)
    )
  }

  /**
   * Hook `node.onWidgetChanged` to keep `ckptPathRef` updated when the user edits the widget.
   */
  private ensureWidgetChangeHook() {
    const node: any = this.node
    if (!node || typeof node !== 'object') return
    if (this.onWidgetChangedWrapper) return

    this.onWidgetChangedOriginal = node.onWidgetChanged
    this.onWidgetChangedWrapper = (
      name: string,
      value: any,
      oldValue: any,
      widget: any
    ) => {
      if (name === CKPT_WIDGET) {
        this.ckptPathRef.value = String(value ?? '')
      }

      const original = this.onWidgetChangedOriginal
      if (typeof original === 'function') {
        try {
          return original.call(node, name, value, oldValue, widget)
        } catch {
          // ignore
        }
      }

      return undefined
    }

    node.onWidgetChanged = this.onWidgetChangedWrapper
  }

  /** Restore `node.onWidgetChanged` if we are still the active hook owner. */
  private unhookWidgetChange() {
    const node: any = this.node
    if (!node || typeof node !== 'object') return

    if (node.onWidgetChanged === this.onWidgetChangedWrapper) {
      node.onWidgetChanged = this.onWidgetChangedOriginal
    }

    this.onWidgetChangedOriginal = null
    this.onWidgetChangedWrapper = null
  }

  /** Read the current widget value into `ckptPathRef` (used on initial injection). */
  private syncFromWidget() {
    const widget = this.findWidget(CKPT_WIDGET)
    this.ckptPathRef.value = String(widget?.value ?? '')
  }

  /**
   * VueNodes mode: schedule a few sync attempts to catch late widget hydration.
   */
  private scheduleHydrationSync(ctx: InjectionContext) {
    this.clearHydrationSync()
    if (ctx.mode !== 'vue') return

    const delays = [0, 50, 150, 400, 800]
    for (const delay of delays) {
      const timer = window.setTimeout(() => {
        try {
          this.syncFromWidget()
        } catch {
          // ignore
        }
      }, delay)
      this.hydrationSyncTimers.push(timer)
    }
  }

  private clearHydrationSync() {
    for (const timer of this.hydrationSyncTimers) {
      try {
        window.clearTimeout(timer)
      } catch {
        // ignore
      }
    }
    this.hydrationSyncTimers = []
  }

  /** Commit path back into the widget value. */
  private commitPath(next: string) {
    const widget = this.findWidget(CKPT_WIDGET)
    if (!widget) return

    const normalized = String(next ?? '')
    this.setWidgetValue(widget, normalized)
    this.ckptPathRef.value = normalized
  }
}

// Side-effect registration: resolve controller by node type.
BaseHikazeNodeController.register(NODE_TYPE, HikazeCheckpointLoaderController)
