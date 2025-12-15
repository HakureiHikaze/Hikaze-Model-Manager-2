<template>
  <table class="hikaze-grid">
    <colgroup>
      <col
        v-for="col in columns"
        :key="col.key"
        :style="{ width: col.width ?? undefined }"
      />
    </colgroup>
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          :data-col-key="col.key"
          :style="{
            width: col.width ?? undefined,
            minWidth: col.width ?? undefined,
            maxWidth: col.width ?? undefined,
            textAlign: col.align ?? 'left'
          }"
        >
          {{ col.label ?? col.key }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(row, idx) in rows"
        :key="getRowKey ? getRowKey(row, idx) : idx"
      >
        <td
          v-for="col in columns"
          :key="col.key"
          :data-col-key="col.key"
          :style="{
            width: col.width ?? undefined,
            minWidth: col.width ?? undefined,
            maxWidth: col.width ?? undefined,
            textAlign: col.align ?? 'left'
          }"
        >
          <slot
            name="cell"
            :row="row"
            :column="col"
            :value="getValue(row, col)"
            :index="idx"
          >
            {{ formatValue(getValue(row, col), row, col) }}
          </slot>
        </td>
      </tr>

      <tr v-if="rows.length === 0">
        <td class="empty" :colspan="columns.length">
          {{ emptyText }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type GridColumn<Row = any> = {
  /**
   * Column id. Used as the v-for key and for styling.
   */
  key: string
  /**
   * Header label. Defaults to `key`.
   */
  label?: string
  /**
   * Optional column width (CSS value).
   */
  width?: string
  /**
   * Alignment for header/cells.
   */
  align?: 'left' | 'right' | 'center'
  /**
   * Value accessor used for sorting/filtering and default cell rendering.
   * Defaults to `row[col.key]`.
   */
  getValue?: (row: Row) => unknown
  /**
   * Value formatter used when no `#cell` slot is provided.
   */
  format?: (value: unknown, row: Row) => string
}

const props = defineProps<{
  rows: readonly any[]
  columns: readonly GridColumn[]
  emptyText?: string
  getRowKey?: ((row: any, index: number) => string | number) | null
}>()

const emptyText = computed(() => props.emptyText ?? 'No rows.')
const rows = computed(() => (Array.isArray(props.rows) ? props.rows : []))

function getValue(row: any, col: GridColumn) {
  try {
    if (typeof col.getValue === 'function') return col.getValue(row)
  } catch {
    // ignore
  }
  return row?.[col.key]
}

function formatValue(value: unknown, row: any, col: GridColumn) {
  try {
    if (typeof col.format === 'function') return col.format(value, row)
  } catch {
    // ignore
  }
  if (value == null) return ''
  return String(value)
}
</script>

<style scoped>
.hikaze-grid {
  width: 100% !important;
  min-width: 100%;
  max-width: 100%;
  table-layout: fixed !important;
  border-collapse: collapse;
  font-size: 12px;
}

.hikaze-grid thead th {
  position: sticky;
  top: 0;
  background: rgba(15, 17, 23, 0.92);
  color: #aab3c4;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.45px;
  font-size: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 8px;
  user-select: none;
  white-space: nowrap;
}

.hikaze-grid tbody td {
  padding: 7px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  vertical-align: middle;
}

.empty {
  color: #aab3c4;
  padding: 12px 10px;
}
</style>
