<template>
  <div class="shell">
    <header class="shell__header">
      <span class="pill">Hikaze Model Manager 2</span>
      <h1>Custom Node UI Shell</h1>
      <p>
        Replace this shell with your Vue components. Hook into ComfyUI's front-end extension points
        to override the node body for your V3 nodes.
      </p>
    </header>
    <section class="shell__body">
      <div class="card">
        <h2>Next steps</h2>
        <ol>
          <li>Implement front-end extension glue that maps a node_id to this component.</li>
          <li>Use props/state to sync node inputs; call provided callbacks to update values.</li>
          <li>Build with <code>npm run build</code> and serve from the registered web folder.</li>
        </ol>
      </div>
      <div class="card">
        <h2>Why this shell?</h2>
        <p>
          It reserves a minimal container and styling so you can focus on wiring ComfyUI data
          into your own Vue/TS components.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.shell {
  padding: 32px;
  max-width: 960px;
  margin: 0 auto;
  color: #e8ecf2;
}

.shell__header h1 {
  margin: 12px 0 8px;
}

.shell__header p {
  color: #aab3c4;
  margin: 0;
}

.pill {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #5bc0f8, #6f8bff);
  color: #0f1117;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4px;
}

.shell__body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
}

ol {
  margin: 8px 0 0 20px;
  color: #cfd6e5;
}

code {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 6px;
}
</style>
