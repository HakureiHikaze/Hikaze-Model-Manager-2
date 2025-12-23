import HikazeLoraPowerLoaderOverlay from '../../components/HikazeLoraPowerLoaderOverlay.vue'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

const NODE_TYPE = 'HikazeLoraPowerLoader'

export class HikazeLoraPowerLoaderController extends BaseHikazeNodeController {
  protected getComponent() {
    return HikazeLoraPowerLoaderOverlay
  }
}

// Side-effect registration: resolve controller by node type.
BaseHikazeNodeController.register(NODE_TYPE, HikazeLoraPowerLoaderController)
