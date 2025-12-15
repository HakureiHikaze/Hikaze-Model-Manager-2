import { ref } from 'vue'

import HikazeLoraPowerLoaderOverlay from '../../components/HikazeLoraPowerLoaderOverlay.vue'
import type { InjectionContext, NodeBodyOverlayDefinition } from '../types'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

/**
 * Controller for `HikazeLoraPowerLoader` node.
 *
 * Behavior:
 * - VueNodes mode: render `HikazeLoraPowerLoaderOverlay` over the node body and keep the grid synced
 *   with the schema widget `lora_json` (persisted to workflow JSON).
 */
//TODO: - Legacy mode:  render `HikazeLoraPowerLoaderOverlay` over the legacy node body and keep it synced
//        with the schema widget `lora_json` (persisted to workflow JSON).
const NODE_TYPE = 'HikazeLoraPowerLoader'
const JSON_WIDGET = 'lora_json'

export class HikazeLoraPowerLoaderController extends BaseHikazeNodeController {
  /** Reactive copy of widget JSON used by the overlay component. */
  private readonly loraJsonRef = ref<string>('')

  /** Stored original handler so we can restore it on dispose. */
  private onWidgetChangedOriginal: any = null
  /** Wrapper handler that syncs `loraJsonRef` then delegates to original. */
  private onWidgetChangedWrapper: any = null

  /**
   * Inject lifecycle: hook widget changes, sync initial value, then mount overlays.
   */
  override inject(ctx: InjectionContext) {
    this.ensureWidgetChangeHook()
    this.syncFromWidget()
    super.inject(ctx)
  }

  /** Dispose lifecycle: unhook widget changes and let base class cleanup overlays. */
  override dispose() {
    this.unhookWidgetChange()
    super.dispose()
  }

  /** VueNodes mode: render a full overlay component over the node body. */
  protected override getVueBodyOverlays(
    _ctx: InjectionContext
  ): NodeBodyOverlayDefinition[] {
    return [
      {
        key: 'hikaze-lora-power-loader',
        title: 'Hikaze LoRA Power Loader',
        cursor: 'default',
        pointerEvents: 'auto',
        // VueNodes mode: mount a full overlay component over the node body.
        // The component reads `loraJsonRef` and commits updates via `commitJson(...)`,
        // so the canonical value remains the schema widget value (workflow-persisted).
        component: HikazeLoraPowerLoaderOverlay,
        props: () => ({
          nodeId: this.node?.id ?? null,
          loraJsonRef: this.loraJsonRef,
          commitJson: (next: string) => this.commitJson(next)
        })
      }
    ]
  }

  // TODO(legacy): replace prompt-based editing with a proper UI (e.g., table/picker/editor).
  protected override onInjectLegacy(_ctx: InjectionContext) {
    this.hookLegacyTextWidgetClick(JSON_WIDGET, (current) =>
      window.prompt('Edit LoRA JSON', current)
    )
  }

  /**
   * Hook `node.onWidgetChanged` to keep `loraJsonRef` updated when the user edits the widget.
   * ComfyUI triggers this callback for many widget edits (depending on mode/version).
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
      if (name === JSON_WIDGET) {
        this.loraJsonRef.value = String(value ?? '')
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

  /** Read the current widget value into `loraJsonRef` (used on initial injection). */
  private syncFromWidget() {
    const widget = this.findWidget(JSON_WIDGET)
    this.loraJsonRef.value = String(widget?.value ?? '')
  }

  /**
   * Commit JSON back into the widget value (persisted), and update our ref.
   * The overlay component calls this when the user edits JSON via UI.
   */
  private commitJson(next: string) {
    const widget = this.findWidget(JSON_WIDGET)
    if (!widget) return

    const normalized = String(next ?? '')
    this.setWidgetValue(widget, normalized)
    this.loraJsonRef.value = normalized
  }
}

// Side-effect registration: resolve controller by node type.
BaseHikazeNodeController.register(NODE_TYPE, HikazeLoraPowerLoaderController)
