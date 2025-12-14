import { ref } from 'vue'

import HikazeLoraPowerLoaderOverlay from '../../components/HikazeLoraPowerLoaderOverlay.vue'
import type { InjectionContext, NodeBodyOverlayDefinition } from '../types'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

const NODE_TYPE = 'HikazeLoraPowerLoader'
const JSON_WIDGET = 'lora_json'

export class HikazeLoraPowerLoaderController extends BaseHikazeNodeController {
  private readonly loraJsonRef = ref<string>('')

  private onWidgetChangedOriginal: any = null
  private onWidgetChangedWrapper: any = null

  override inject(ctx: InjectionContext) {
    this.ensureWidgetChangeHook()
    this.syncFromWidget()
    super.inject(ctx)
  }

  override dispose() {
    this.unhookWidgetChange()
    super.dispose()
  }

  protected override getVueBodyOverlays(
    _ctx: InjectionContext
  ): NodeBodyOverlayDefinition[] {
    return [
      {
        key: 'hikaze-lora-power-loader',
        title: 'Hikaze LoRA Power Loader',
        cursor: 'default',
        pointerEvents: 'auto',
        component: HikazeLoraPowerLoaderOverlay,
        props: () => ({
          nodeId: this.node?.id ?? null,
          loraJsonRef: this.loraJsonRef,
          commitJson: (next: string) => this.commitJson(next)
        })
      }
    ]
  }

  protected override onInjectLegacy(_ctx: InjectionContext) {
    this.hookLegacyTextWidgetClick(JSON_WIDGET, (current) =>
      window.prompt('Edit LoRA JSON', current)
    )
  }

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

  private unhookWidgetChange() {
    const node: any = this.node
    if (!node || typeof node !== 'object') return

    if (node.onWidgetChanged === this.onWidgetChangedWrapper) {
      node.onWidgetChanged = this.onWidgetChangedOriginal
    }

    this.onWidgetChangedOriginal = null
    this.onWidgetChangedWrapper = null
  }

  private syncFromWidget() {
    const widget = this.findWidget(JSON_WIDGET)
    this.loraJsonRef.value = String(widget?.value ?? '')
  }

  private commitJson(next: string) {
    const widget = this.findWidget(JSON_WIDGET)
    if (!widget) return

    const normalized = String(next ?? '')
    this.setWidgetValue(widget, normalized)
    this.loraJsonRef.value = normalized
  }
}

BaseHikazeNodeController.register(NODE_TYPE, HikazeLoraPowerLoaderController)

