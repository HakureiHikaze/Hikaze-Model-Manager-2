// Hikaze Model Manager 2
// - New frontend (VueNodes): mount a Vue overlay that covers the node widget area.
// - Old frontend: keep a stub entry for future implementation.

import { createApp } from "vue";
import HikazeNodeOverlay from "../src/components/HikazeNodeOverlay.vue";

const EXT_NAME = "Hikaze.ModelManager2";

const HIKAZE_NODE_TYPE_PREFIX = "Hikaze";
const HAS_OWN =
  Object.hasOwn ??
  ((obj, key) => Object.prototype.hasOwnProperty.call(obj, key));
const ON_ADDED_HOOK_FLAG = "__hikazeOnAddedHooked";
const LEGACY_WIDGET_HOOK_FLAG = "__hikazeLegacyWidgetHooked";
const VUE_NODES_SETTING_ID = "Comfy.VueNodes.Enabled";
const VUE_NODES_SETTING_EVENT = `${VUE_NODES_SETTING_ID}.change`;
const SETTINGS_HOOK_FLAG = "__hikazeVueNodesSettingHooked";

console.info(`[${EXT_NAME}] loaded`);

function getComfyApp() {
  return globalThis?.comfyAPI?.app?.app ?? globalThis?.app;
}

function isVueNodesEnabled() {
  const mode = globalThis?.LiteGraph?.vueNodesMode;
  if (typeof mode === "boolean") return mode;
  return !!document.querySelector("[data-testid='transform-pane']");
}

function isHikazeNode(node) {
  // In the new frontend, `nodeCreated` fires inside the node constructor, and
  // `node.type` may still be an empty string at that time. `node.comfyClass`
  // (set on the prototype at registration time) is the stable identifier.
  const nodeType = node?.comfyClass || node?.type;
  return typeof nodeType === "string" && nodeType.startsWith(HIKAZE_NODE_TYPE_PREFIX);
}

function getVueNodeElement(nodeId) {
  return document.querySelector(`.lg-node[data-node-id="${nodeId}"]`);
}

function getVueNodeWidgetBodyElement(nodeId) {
  const nodeEl = getVueNodeElement(nodeId);
  if (!nodeEl) return null;

  // "Node body (widget area)" in VueNodes.
  return nodeEl.querySelector(".lg-node-widgets");
}

const overlayStateByNodeId = new Map();

function disposeVueOverlays() {
  for (const state of overlayStateByNodeId.values()) {
    try {
      state?.vueApp?.unmount?.();
    } catch {
      // ignore
    }
    try {
      state?.host?.remove?.();
    } catch {
      // ignore
    }
  }

  overlayStateByNodeId.clear();

  // Best-effort cleanup for orphaned hosts (e.g., after hot reloads).
  try {
    document
      .querySelectorAll("[data-hikaze-node-overlay-host='1']")
      .forEach((el) => el.remove());
  } catch {
    // ignore
  }
}

function mountVueOverlayForNode(node, attemptsRemaining = 50) {
  const nodeId = node?.id;
  if (nodeId == null) return;

  const key = String(nodeId);
  if (overlayStateByNodeId.has(key)) return;

  const bodyEl = getVueNodeWidgetBodyElement(nodeId);
  if (!bodyEl) {
    if (attemptsRemaining <= 0) return;
    setTimeout(() => mountVueOverlayForNode(node, attemptsRemaining - 1), 100);
    return;
  }

  if (bodyEl.querySelector("[data-hikaze-node-overlay-host='1']")) {
    overlayStateByNodeId.set(key, { host: null, vueApp: null });
    return;
  }

  bodyEl.style.position = bodyEl.style.position || "relative";

  const host = document.createElement("div");
  host.dataset.hikazeNodeOverlayHost = "1";
  host.dataset.hikazeNodeId = key;
  host.style.position = "absolute";
  host.style.inset = "0";
  host.style.zIndex = "50";
  host.style.pointerEvents = "none";

  bodyEl.appendChild(host);

  const vueApp = createApp(HikazeNodeOverlay, { node });
  vueApp.mount(host);

  overlayStateByNodeId.set(key, { host, vueApp });
}

function mountLegacyOverlayForNode(_node) {
  // Legacy UI (LiteGraph canvas): widgets are not DOM elements. Intercept the
  // schema-generated text widget click to prevent the built-in `canvas.prompt`
  // and route it to our own event (placeholder: `window.prompt`).
  const node = _node;
  const widgets = node?.widgets;
  if (!Array.isArray(widgets) || widgets.length === 0) return;

  const ckptWidget = widgets.find((w) => w?.name === "ckpt_path");
  if (!ckptWidget) return;

  hookLegacyTextWidget(node, ckptWidget);
}

function attachOverlayForMode(node, vueNodesEnabled) {
  if (!isHikazeNode(node)) return;
  if (vueNodesEnabled) {
    mountVueOverlayForNode(node);
    return;
  }
  mountLegacyOverlayForNode(node);
}

function attachOverlay(node) {
  if (!isHikazeNode(node)) return;

  if (isVueNodesEnabled()) {
    mountVueOverlayForNode(node);
    return;
  }

  mountLegacyOverlayForNode(node);
}

function defineHiddenFlag(obj, key) {
  try {
    Object.defineProperty(obj, key, {
      value: true,
      enumerable: false,
      configurable: true,
    });
    return true;
  } catch {
    try {
      obj[key] = true;
      return true;
    } catch {
      return false;
    }
  }
}

function setWidgetValue(node, widget, next, e, canvas) {
  const oldValue = widget?.value;
  if (next === oldValue) return;

  if (typeof widget?.setValue === "function") {
    try {
      widget.setValue(next, { e, node, canvas });
    } catch (err) {
      console.warn(`[${EXT_NAME}] legacy setValue failed`, err);
    }
  } else {
    try {
      widget.value = next;
    } catch {
      // ignore
    }

    try {
      const pos = canvas?.graph_mouse;
      widget.callback?.(widget.value, canvas, node, pos, e);
    } catch {
      // ignore
    }

    try {
      node?.onWidgetChanged?.(widget.name ?? "", widget.value, oldValue, widget);
      if (node?.graph) node.graph._version++;
    } catch {
      // ignore
    }
  }

  try {
    node?.onResize?.();
  } catch {
    // ignore
  }
  try {
    node?.graph?.setDirtyCanvas?.(true, true);
  } catch {
    // ignore
  }
}

function hookLegacyTextWidget(node, widget) {
  if (!node || !widget) return;
  if (HAS_OWN(widget, LEGACY_WIDGET_HOOK_FLAG)) return;
  defineHiddenFlag(widget, LEGACY_WIDGET_HOOK_FLAG);

  const originalOnPointerDown = widget.onPointerDown;

  widget.onPointerDown = function hikazeLegacyPointerDown(pointer, nodeFromCanvas, canvas) {
    // Let an existing handler run first (if any).
    if (typeof originalOnPointerDown === "function") {
      try {
        const handled = originalOnPointerDown.call(this, pointer, nodeFromCanvas, canvas);
        if (handled) return true;
      } catch (err) {
        console.warn(`[${EXT_NAME}] legacy widget onPointerDown error`, err);
      }
    }

    const effectiveNode = nodeFromCanvas ?? node;

    // In ComfyUI's LiteGraph fork, returning `true` stops the default TextWidget
    // path (which calls `canvas.prompt`). If we stop it, we must also ensure we
    // clean `canvas.node_widget`, otherwise selection state can get stuck.
    const priorFinally = pointer?.finally;
    if (pointer && canvas) {
      pointer.finally = () => {
        try {
          if (typeof priorFinally === "function") priorFinally();
        } finally {
          try {
            canvas.node_widget = null;
          } catch {
            // ignore
          }
        }
      };
    }

    if (pointer) {
      pointer.onClick = () => {
        const current = String(widget.value ?? "");
        const next = window.prompt("Enter absolute checkpoint path", current);
        if (next != null && next !== current) {
          const e = pointer.eUp ?? pointer.eDown ?? null;
          setWidgetValue(effectiveNode, widget, next, e, canvas);
        }
      };
    } else {
      // Fallback (should be rare): prompt immediately.
      const current = String(widget.value ?? "");
      const next = window.prompt("Enter absolute checkpoint path", current);
      if (next != null && next !== current) {
        setWidgetValue(effectiveNode, widget, next, null, canvas);
      }
    }

    return true;
  };
}

function getActiveGraph() {
  const app = getComfyApp();
  return app?.canvas?.graph ?? app?.graph ?? globalThis?.graph ?? null;
}

function reinjectForCurrentGraph(vueNodesEnabled, attemptsRemaining = 20) {
  const graph = getActiveGraph();
  const nodes = graph?._nodes ?? graph?.nodes;
  if (!Array.isArray(nodes)) {
    if (attemptsRemaining <= 0) return;
    setTimeout(
      () => reinjectForCurrentGraph(vueNodesEnabled, attemptsRemaining - 1),
      100
    );
    return;
  }

  for (const node of nodes) {
    attachOverlayForMode(node, vueNodesEnabled);
  }
}

function installVueNodesSettingListener(attemptsRemaining = 40) {
  const app = getComfyApp();
  const settings = app?.ui?.settings;
  if (!settings || typeof settings.addEventListener !== "function") {
    if (attemptsRemaining <= 0) return;
    setTimeout(
      () => installVueNodesSettingListener(attemptsRemaining - 1),
      250
    );
    return;
  }

  if (HAS_OWN(settings, SETTINGS_HOOK_FLAG)) return;
  defineHiddenFlag(settings, SETTINGS_HOOK_FLAG);

  settings.addEventListener(VUE_NODES_SETTING_EVENT, (event) => {
    const enabled = !!event?.detail?.value;

    // Switching between legacy/VueNodes tears down and recreates rendering layers.
    // Re-run our injection for existing nodes and reset stale overlay state.
    disposeVueOverlays();
    reinjectForCurrentGraph(enabled);
  });
}

function ensureOnAddedHook(node) {
  if (!node || !isHikazeNode(node)) return;
  // Guard against prototype-chain pollution (e.g. Object.prototype.__hikazeOnAddedHooked).
  if (HAS_OWN(node, ON_ADDED_HOOK_FLAG)) return;
  try {
    Object.defineProperty(node, ON_ADDED_HOOK_FLAG, {
      value: true,
      enumerable: false,
      configurable: true,
    });
  } catch {
    try {
      node[ON_ADDED_HOOK_FLAG] = true;
    } catch {
      // ignore
    }
  }

  const originalOnAdded = node.onAdded;
  node.onAdded = function onAddedHikaze(graph) {
    try {
      return typeof originalOnAdded === "function"
        ? originalOnAdded.call(this, graph)
        : undefined;
    } finally {
      // node.id is assigned by graph.add() before onAdded is called.
      attachOverlay(this);
    }
  };
}

function registerExtension() {
  const app = getComfyApp();
  if (!app?.registerExtension) {
    setTimeout(registerExtension, 250);
    return;
  }

  app.registerExtension({
    name: EXT_NAME,
    nodeCreated(node) {
      // nodeCreated fires in the node constructor (before graph.add assigns node.id).
      // Hook into node.onAdded so we can inject using the final node.id and DOM.
      ensureOnAddedHook(node);

      // Fallback: if node already has a stable id (e.g., some workflows/graphs),
      // attempt immediately as well.
      attachOverlay(node);
    },
    loadedGraphNode(node) {
      attachOverlay(node);
    },
  });

  installVueNodesSettingListener();

  console.info(`[${EXT_NAME}] registered`);
}

registerExtension();
