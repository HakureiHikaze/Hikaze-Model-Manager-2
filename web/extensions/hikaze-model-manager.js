// Hikaze Model Manager 2
// ComfyUI front-end extension entry (ES module).
//
// ComfyUI will auto-import every `.js` under the configured web root (`web/dist`),
// so this project builds into a single side-effectful bundle that registers itself.

// Register all node controllers (side-effect imports).
import "../src/injection/registerControllers";
import { HikazeInjectionManager } from "../src/injection/manager";

const EXT_NAME = "Hikaze.ModelManager2";

console.info(`[${EXT_NAME}] loaded`);

/**
 * Best-effort accessor for the ComfyUI app instance.
 * Different ComfyUI builds expose it under different globals.
 */
function getComfyApp() {
  const ret = globalThis?.comfyAPI?.app?.app ?? globalThis?.app;
  if (!ret) {
    // Should be available by the time registerExtension runs.
    console.warn(`[${EXT_NAME}] Failed to get app instance.`);
  }
  return ret;
}

const manager = new HikazeInjectionManager({
  extName: EXT_NAME,
  getComfyApp,
});

/**
 * Register the ComfyUI extension once `app.registerExtension` becomes available.
 * ComfyUI may load extensions before the app is fully initialized, so we retry.
 */
function registerExtension() {
  const app = getComfyApp();
  if (!app?.registerExtension) {
    setTimeout(registerExtension, 250);
    return;
  }

  app.registerExtension({
    name: EXT_NAME,

    /**
     * Called when the app is initialized and ready.
     * We install our global event listeners here.
     */
    async setup(app) {
      console.info(`[${EXT_NAME}] setup() called`);
      manager.install();
    },

    /**
     * Called after a workflow is loaded (from file, API, or tab switch).
     * This is the ideal time to inject UI overlays for the entire graph.
     */
    async afterConfigureGraph(missingNodeTypes) {
      manager.reinjectAll("graph-loaded");
    },

    /**
     * Called when a new node is added (e.g. from menu).
     */
    nodeCreated(node) {
      manager.onNodeCreated(node);
    },

    getCanvasMenuItems() {
      return [
        {
          content: "Reload Hikaze Node UI",
          // Manual reinjection is useful during development/debugging.
          callback: () => manager.reinjectAll("manual-reload"),
        },
      ];
    },
  });

  console.info(`[${EXT_NAME}] registered`);
}

registerExtension();
