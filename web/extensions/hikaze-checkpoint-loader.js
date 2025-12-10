// Lightweight front-end overlay for Hikaze Checkpoint Loader.
// Places a transparent layer over the socketless text input, intercepts clicks,
// prompts for a path, and writes it back into the widget.

(function () {
  const EXT_NAME = "Hikaze.CheckpointLoaderOverlay";

  function isHikazeNode(node) {
    return node?.type === "HikazeCheckpointLoader";
  }

  function attachOverlay(node) {
    if (!node?.widgets || !Array.isArray(node.widgets)) return;
    const widget = node.widgets.find((w) => w.name === "ckpt_path");
    if (!widget || !widget.inputEl) return;

    // Style the input as read-only with placeholder.
    try {
      widget.inputEl.setAttribute("readonly", "readonly");
      widget.inputEl.setAttribute("placeholder", "Click to select");
      widget.inputEl.style.cursor = "pointer";
    } catch (_) {}

    const parent = widget.inputEl.parentElement;
    if (!parent) return;
    parent.style.position = parent.style.position || "relative";

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.cursor = "pointer";
    overlay.style.background = "transparent";
    overlay.title = "Click to select a checkpoint path";

    const setValue = (val) => {
      widget.value = val;
      widget.inputEl.value = val;
      if (typeof node.onResize === "function") node.onResize();
      if (node.graph?.setDirtyCanvas) node.graph.setDirtyCanvas(true, true);
    };

    overlay.addEventListener("click", () => {
      const current = widget.value || "";
      const next = window.prompt("Enter absolute checkpoint path", current);
      if (next !== null && next !== undefined && next !== current) {
        setValue(next);
      }
    });

    parent.appendChild(overlay);
  }

  function setup(app) {
    app.registerExtension({
      name: EXT_NAME,
      async nodeCreated(node) {
        if (isHikazeNode(node)) {
          attachOverlay(node);
        }
      },
      async nodeAdded(node) {
        if (isHikazeNode(node)) {
          attachOverlay(node);
        }
      },
    });
  }

  const trySetup = () => {
    const app = globalThis?.app;
    if (app?.registerExtension) {
      setup(app);
    } else {
      // retry after ComfyUI front-end initializes
      setTimeout(trySetup, 500);
    }
  };

  trySetup();
})();
