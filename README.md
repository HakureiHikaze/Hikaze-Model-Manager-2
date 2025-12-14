# Hikaze Model Manager 2 (Scaffold)

This is an empty scaffold for a ComfyUI custom node project using Python for backend nodes and Vue + TypeScript for the frontend UI.

## Backend
- Add node implementations under this package and return them from `HikazeModelManagerExtension.get_node_list()`.
- `base_nodes.py` provides `HikazeBaseNode`, an abstract V3 node for subclasses to extend.
- `pyproject.toml` declares the `web/dist` directory for frontend assets via `[tool.comfy] web = "web/dist"`.

## Frontend
- The `web/` directory is set up for a Vue 3 + TypeScript + Vite build.
- `BaseNodeContainer.vue` is a reusable shell for node-specific UIs; import/combine it in your node components.
- `npm run build` outputs a single ComfyUI extension bundle to `web/dist/hikaze-checkpoint-loader.js` (ComfyUI auto-imports every `.js` under `web/dist`).
- `web/extensions/hikaze-checkpoint-loader.js` is the extension entry source; it mounts a Vue overlay over the node widget area in the new frontend (VueNodes).

## Getting started
```bash
cd custom_nodes/Hikaze-Model-Manager-2/web
npm install
npm run dev    # optional local preview shell
npm run build  # build the ComfyUI extension bundle
```

Then start ComfyUI; the built assets will be served from `/extensions/hikaze-model-manager-2/`.
