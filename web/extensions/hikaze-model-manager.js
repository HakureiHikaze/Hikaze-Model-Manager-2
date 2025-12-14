// Hikaze Model Manager 2
// Entry module for ComfyUI front-end extension loading.

import "../src/injection/registerControllers";
import { HikazeInjectionManager } from "../src/injection/manager";

const EXT_NAME = "Hikaze.ModelManager2";

console.info(`[${EXT_NAME}] loaded`);

function getComfyApp() {
  return globalThis?.comfyAPI?.app?.app ?? globalThis?.app;
}

const manager = new HikazeInjectionManager({
  extName: EXT_NAME,
  getComfyApp,
});

function registerExtension() {
  const app = getComfyApp();
  if (!app?.registerExtension) {
    setTimeout(registerExtension, 250);
    return;
  }

  app.registerExtension({
    name: EXT_NAME,
    nodeCreated(node) {
      manager.onNodeCreated(node);
    },
    loadedGraphNode(node) {
      manager.onLoadedGraphNode(node);
    },
    getCanvasMenuItems() {
      return [
        {
          content: "Reload Hikaze Node UI",
          callback: () => manager.reinjectAll("manual-reload"),
        },
      ];
    },
  });

  manager.install();
  manager.reinjectAll("startup");

  console.info(`[${EXT_NAME}] registered`);
}

registerExtension();

