<script setup>
import { computed } from 'vue'

const props = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const rows = computed(() => Object.entries(props.metadata ?? {}))
</script>

<template>
  <div class="metadata-table" aria-label="数据集元数据">
    <table v-if="rows.length">
      <tbody>
        <tr v-for="[key, value] in rows" :key="key">
          <th scope="row">{{ key }}</th>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="metadata-table__empty">暂无元数据信息。</p>
  </div>
</template>

<style scoped>
.metadata-table {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-panel);
}

.metadata-table table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.metadata-table tr + tr {
  border-top: 1px solid var(--color-border);
}

.metadata-table th,
.metadata-table td {
  padding: 13px 15px;
  text-align: left;
  vertical-align: top;
  line-height: 1.65;
}

.metadata-table th {
  width: 32%;
  color: var(--color-ink-soft);
  background: var(--color-panel-subtle);
  font-size: 13px;
  font-weight: 800;
}

.metadata-table td {
  color: var(--color-ink);
  font-size: 13px;
  overflow-wrap: anywhere;
}

.metadata-table__empty {
  margin: 0;
  padding: 16px;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 560px) {
  .metadata-table table,
  .metadata-table tbody,
  .metadata-table tr,
  .metadata-table th,
  .metadata-table td {
    display: block;
    width: 100%;
  }

  .metadata-table th {
    padding-bottom: 4px;
  }

  .metadata-table td {
    padding-top: 4px;
  }
}
</style>
