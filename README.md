# Hikaze Model Manager 2 (Scaffold)

This is an empty scaffold for a ComfyUI custom node project using Python for backend nodes and Vue + TypeScript for the frontend UI.

## Backend
- Add node implementations under this package and return them from `HikazeModelManagerExtension.get_node_list()`.
- `base_nodes.py` provides `HikazeBaseNode`, an abstract V3 node for subclasses to extend.
- `pyproject.toml` declares the `web` directory for frontend assets via `[tool.comfy] web = "web"`.

## Frontend
- The `web/` directory is set up for a Vue 3 + TypeScript + Vite build.
- `BaseNodeContainer.vue` is a reusable shell for node-specific UIs; import/combine it in your node components.
- Implement your UI in `web/src` and build artifacts to `web/dist` (default Vite config).
- `web/extensions/hikaze-checkpoint-loader.js` adds a transparent overlay for the Hikaze Checkpoint Loader input to prompt for an absolute path.

## Getting started
```bash
cd custom_nodes/Hikaze-Model-Manager-2/web
npm install
npm run dev    # or npm run build
```

Then start ComfyUI; the built assets will be served from `/extensions/hikaze-model-manager-2/`.
