import HikazeCheckpointLoaderOverlay from '../../components/HikazeCheckpointLoaderOverlay.vue'
import { BaseHikazeNodeController } from './BaseHikazeNodeController'

const NODE_TYPE = 'HikazeCheckpointLoader'

export class HikazeCheckpointLoaderController extends BaseHikazeNodeController {
  protected getComponent() {
    return HikazeCheckpointLoaderOverlay
  }
}

// Side-effect registration: resolve controller by node type.
BaseHikazeNodeController.register(NODE_TYPE, HikazeCheckpointLoaderController)
