import type { InjectionContext, WidgetOverlayDefinition } from '../types'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

const NODE_TYPE = 'HikazeCheckpointLoader'
const CKPT_WIDGET = 'ckpt_path'

export class HikazeCheckpointLoaderController extends BaseHikazeNodeController {
  protected override getVueWidgetOverlays(
    _ctx: InjectionContext
  ): WidgetOverlayDefinition[] {
    return [
      {
        key: CKPT_WIDGET,
        widgetName: CKPT_WIDGET,
        title: 'Click to select a checkpoint path',
        patchInput: {
          readonly: true,
          placeholder: 'Click to select',
          cursor: 'pointer'
        },
        onClick: ({ widget, inputEl }) => {
          const current = String(widget?.value ?? '')
          const next = window.prompt('Enter absolute checkpoint path', current)
          if (next != null && next !== current) {
            this.setWidgetValue(widget, next, { inputEl })
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

