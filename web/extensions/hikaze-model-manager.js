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
  return globalThis?.comfyAPI?.app?.app ?? globalThis?.app;
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
     * This is the best place to perform initial injection.
     */
    async setup(app) {
      console.info(`[${EXT_NAME}] setup() called`);
      manager.install();
      // Give DOM a moment to settle (e.g. VueNodes initialization)
      setTimeout(() => manager.reinjectAll("setup"), 200);
    },

    nodeCreated(node) {
      manager.onNodeCreated(node);
    },
    
    // We can rely on manager's graph hook or onConfigure for full loads,
    // but keeping this doesn't hurt.
    loadedGraphNode(node) {
      manager.onLoadedGraphNode(node);
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
