import type { InjectionContext, NodeBodyOverlayDefinition } from '../types'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

const NODE_TYPE = 'HikazeCheckpointLoader'
const CKPT_WIDGET = 'ckpt_path'

export class HikazeCheckpointLoaderController extends BaseHikazeNodeController {
  protected override getVueBodyOverlays(
    _ctx: InjectionContext
  ): NodeBodyOverlayDefinition[] {
    return [
      {
        key: CKPT_WIDGET,
        title: 'Click to select a checkpoint path',
        cursor: 'pointer',
        onClick: () => {
          const widget = this.findWidget(CKPT_WIDGET)
          if (!widget) return
          const current = String(widget?.value ?? '')
          const next = window.prompt('Enter absolute checkpoint path', current)
          if (next != null && next !== current) {
            this.setWidgetValue(widget, next)
          }
        }
      }
    ]
  }

  protected override onInjectLegacy(_ctx: InjectionContext) {
    this.hookLegacyTextWidgetClick(CKPT_WIDGET, (current) =>
      window.prompt('Enter absolute checkpoint path', current)
    )
  }
}

BaseHikazeNodeController.register(NODE_TYPE, HikazeCheckpointLoaderController)
