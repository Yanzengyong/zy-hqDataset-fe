<script setup>
import { computed } from 'vue'
import { ArrowRight, Database } from 'lucide-vue-next'
import EmptyState from '../common/EmptyState.vue'

const props = defineProps({
  datasets: {
    type: Array,
    default: () => [],
  },
})

const compactDatasets = computed(() => props.datasets.slice(0, 4))
</script>

<template>
  <aside class="related-datasets" aria-labelledby="related-datasets-title">
    <h2 id="related-datasets-title">相关数据集</h2>

    <EmptyState
      v-if="!compactDatasets.length"
      title="暂无相关数据集"
      description="当前数据集还没有配置关联推荐。"
    />

    <ul v-else>
      <li v-for="dataset in compactDatasets" :key="dataset.id">
        <RouterLink
          class="related-datasets__link"
          :to="{ name: 'dataset-detail', params: { id: dataset.id } }"
        >
          <span class="related-datasets__logo" aria-hidden="true">{{ dataset.logoText }}</span>
          <span class="related-datasets__body">
            <strong>{{ dataset.name }}</strong>
            <span>
              <Database :size="13" aria-hidden="true" />
              {{ dataset.category }} · {{ dataset.taskType }}
            </span>
          </span>
          <ArrowRight class="related-datasets__arrow" :size="15" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.related-datasets {
  padding: 18px;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 253, 246, 0.97), rgba(247, 251, 241, 0.94)),
    var(--color-panel);
  box-shadow: 0 14px 34px rgba(23, 74, 61, 0.07);
}

.related-datasets h2 {
  margin: 0 0 14px;
  color: #173f36;
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 0;
}

.related-datasets ul {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.related-datasets__link {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid rgba(31, 141, 122, 0.14);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(31, 141, 122, 0.07), rgba(182, 138, 55, 0.04)),
    rgba(255, 253, 246, 0.78);
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.related-datasets__link:hover {
  border-color: rgba(31, 141, 122, 0.3);
  background: #fffdf6;
}

.related-datasets__logo {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 7px;
  color: #0d675d;
  background: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.related-datasets__body {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.related-datasets__body strong {
  overflow: hidden;
  color: #173f36;
  font-size: 13px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-datasets__body span {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  color: #66766f;
  font-size: 12px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-datasets__arrow {
  color: #1f8d7a;
}
</style>
