<script setup>
import { Boxes, Database, Waypoints } from 'lucide-vue-next'

defineProps({
  metrics: {
    type: Array,
    default: () => [],
  },
})

const metricIcons = [Database, Waypoints, Boxes]
</script>

<template>
  <div class="build-metrics" aria-label="构建概览指标">
    <article
      v-for="(metric, index) in metrics"
      :key="metric.label"
      class="build-metrics__item"
    >
      <span class="build-metrics__icon" aria-hidden="true">
        <component :is="metricIcons[index % metricIcons.length]" :size="18" :stroke-width="1.8" />
      </span>
      <span class="build-metrics__content">
        <span class="build-metrics__label">{{ metric.label }}</span>
        <strong class="build-metrics__value">
          {{ metric.value }}<span v-if="metric.unit">{{ metric.unit }}</span>
        </strong>
        <span class="build-metrics__description">{{ metric.description }}</span>
      </span>
    </article>
  </div>
</template>

<style scoped>
.build-metrics {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.build-metrics__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(169, 216, 216, 0.18);
  border-radius: 8px;
  background: rgba(8, 22, 28, 0.68);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.build-metrics__icon {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(139, 214, 196, 0.26);
  border-radius: 8px;
  color: #8bd6c4;
  background: rgba(31, 138, 112, 0.14);
}

.build-metrics__content {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.build-metrics__label,
.build-metrics__description {
  overflow-wrap: anywhere;
}

.build-metrics__label {
  color: rgba(237, 247, 246, 0.68);
  font-size: 12px;
  line-height: 1.35;
}

.build-metrics__value {
  color: #ffffff;
  font-size: 18px;
  line-height: 1.15;
  letter-spacing: 0;
}

.build-metrics__value span {
  margin-left: 2px;
  font-size: 13px;
  font-weight: 700;
}

.build-metrics__description {
  color: rgba(237, 247, 246, 0.54);
  font-size: 12px;
  line-height: 1.45;
}

@media (max-width: 980px) {
  .build-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .build-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
