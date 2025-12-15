import { createApp } from "vue";
import NodeShell from "./components/NodeShell.vue";
import "./style.css";

// Dev-only entry for `npm run dev` / `vite preview`.
// This is NOT loaded by ComfyUI; ComfyUI loads `web/dist/hikaze-model-manager.js` instead.
createApp(NodeShell).mount("#app");
