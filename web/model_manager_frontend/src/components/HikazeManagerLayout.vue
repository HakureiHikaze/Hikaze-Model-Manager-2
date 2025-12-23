<script setup lang="ts">
defineProps<{
  embedded?: boolean;
  initialTab?: string;
}>()
</script>

<template>
  <div class="hikaze-layout" :class="{ 'is-embedded': embedded, 'has-initial-tab': !!initialTab }">
    <!-- Top Navigation (Tabs) - Only visible if NOT embedded AND NO initialTab -->
    <header class="hikaze-header" v-if="!embedded && !initialTab">
      <slot name="nav">Navigation</slot>
    </header>

    <!-- Main Content Area (Library) -->
    <main class="hikaze-pane-library">
      <slot name="library">Library</slot>
    </main>

    <!-- Right Sidebar (Details) -->
    <aside class="hikaze-pane-details">
      <slot name="details">Details</slot>
    </aside>
  </div>
</template>

<style scoped>
.hikaze-layout {
  display: grid;
  grid-template-columns: 1fr 350px; /* Library | Details */
  grid-template-rows: auto 1fr; /* Header | Content */
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-bg-primary, #0f1115);
  color: var(--color-text-primary, #c9d1d9);
}

/* Header spans full width */
.hikaze-header {
  grid-column: 1 / -1;
  grid-row: 1;
  background-color: #161b22; /* Legacy toolbar bg */
  border-bottom: 1px solid #2d333b;
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

/* Library takes remaining space */
.hikaze-pane-library {
  grid-column: 1;
  grid-row: 2; /* If header exists, row 2. If not... handled below? No, always row 2 is fine if row 1 is auto (0 height if empty/v-if false) */
  overflow-y: hidden; /* Internal scrolling handled by components */
  display: flex;
  flex-direction: column;
  padding: 0; /* Remove default padding, let children handle it */
  position: relative;
}

/* If header is hidden (v-if), the grid row 1 collapses? 
   No, v-if removes the element.
   If element is removed, grid-template-rows: auto 1fr; 
   The first row will have 0 height. Ideally we might want to change template rows.
*/

.hikaze-layout.is-embedded,
.hikaze-layout.has-initial-tab {
   /* No header displayed via v-if */
   /* grid-template-rows: 0fr 1fr;  Effective result */
}

/* Details Sidebar */
.hikaze-pane-details {
  grid-column: 2;
  grid-row: 2; /* Spans from below header to bottom */
  border-left: 1px solid #2d333b;
  overflow-y: auto;
  background-color: #0d1117; /* Legacy detail bg */
}

/* When header is present, details also start at row 2 */
</style>
