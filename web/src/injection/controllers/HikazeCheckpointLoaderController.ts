import type { InjectionContext, NodeBodyOverlayDefinition } from '../types'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

/**
 * Controller for `HikazeCheckpointLoader` node.
 *
 * Behavior:
 * - VueNodes mode: cover the node body with a click overlay; prompt for an absolute path.
 * - Legacy mode: hook the text widget click to open the same prompt.
 */
const NODE_TYPE = 'HikazeCheckpointLoader'
const CKPT_WIDGET = 'ckpt_path'

export class HikazeCheckpointLoaderController extends BaseHikazeNodeController {
  /** VueNodes mode: provide a body overlay that captures click. */
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

  /** Legacy mode: patch the widget click handler. */
  protected override onInjectLegacy(_ctx: InjectionContext) {
    this.hookLegacyTextWidgetClick(CKPT_WIDGET, (current) =>
      window.prompt('Enter absolute checkpoint path', current)
    )
  }
}

// Side-effect registration: resolve controller by node type.
BaseHikazeNodeController.register(NODE_TYPE, HikazeCheckpointLoaderController)
