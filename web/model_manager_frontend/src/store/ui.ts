import { reactive, ref } from 'vue';
import { fetchPendingCount } from '../api/migration';

export interface PanelButton {
  id: string;
  label: string;
  icon?: string;
  callback: () => void;
  styleClass?: string;
  badge?: number | string;
}

const pendingCount = ref(0);
const dynamicButtons = reactive<PanelButton[]>([]);
const panelPosition = ref({ x: 20, y: 20 });

export function useUIStore() {
  async function refreshPendingCount() {
    try {
      const count = await fetchPendingCount();
      pendingCount.value = count;
    } catch (e) {
      console.error('Failed to refresh pending count:', e);
    }
  }

  function setPanelPosition(x: number, y: number) {
    panelPosition.value = { x, y };
  }

  function addButton(btn: PanelButton) {
    const index = dynamicButtons.findIndex(b => b.id === btn.id);
    if (index !== -1) {
      dynamicButtons[index] = btn;
    } else {
      dynamicButtons.push(btn);
    }
  }

  function removeButton(id: string) {
    const index = dynamicButtons.findIndex(b => b.id === id);
    if (index !== -1) {
      dynamicButtons.splice(index, 1);
    }
  }

  function clearButtons() {
    dynamicButtons.length = 0;
  }

  return reactive({
    pendingCount,
    dynamicButtons,
    panelPosition,
    refreshPendingCount,
    setPanelPosition,
    addButton,
    removeButton,
    clearButtons
  });
}
