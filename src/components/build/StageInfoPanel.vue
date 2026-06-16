<script setup>
import { computed } from 'vue'
import TagBadge from '../common/TagBadge.vue'

const props = defineProps({
  stage: {
    type: Object,
    default: null,
  },
})

const sourceTone = computed(() => {
  const toneMap = {
    source: 'green',
    collect: 'blue',
    annotate: 'gold',
    product: 'cyan',
  }

  return toneMap[props.stage?.id] ?? 'default'
})
</script>

<template>
  <aside v-if="stage" class="stage-info" aria-label="当前阶段详情">
    <div class="stage-info__heading">
      <span class="stage-info__marker" :style="{ '--stage-accent': stage.accent }"></span>
      <div>
        <p class="stage-info__subtitle">{{ stage.subtitle }}</p>
        <h2 class="stage-info__title">{{ stage.title }}</h2>
      </div>
    </div>

    <p class="stage-info__description">{{ stage.description }}</p>

    <section class="stage-info__section" aria-label="数据来源与语义对象">
      <h3 class="stage-info__section-title">中医药语义对象</h3>
      <div class="stage-info__tags">
        <TagBadge v-for="item in stage.sourceTypes" :key="item" :tone="sourceTone">
          {{ item }}
        </TagBadge>
      </div>
    </section>

    <section class="stage-info__section" aria-label="流程能力">
      <h3 class="stage-info__section-title">平台能力</h3>
      <ul class="stage-info__capabilities">
        <li v-for="capability in stage.capabilities" :key="capability">
          <span aria-hidden="true"></span>
          {{ capability }}
        </li>
      </ul>
    </section>

    <section class="stage-info__metric-grid" aria-label="阶段指标">
      <div v-for="metric in stage.metrics" :key="metric.label" class="stage-info__metric">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </div>
    </section>
  </aside>
</template>

<style scoped>
.stage-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
  padding: 18px;
  border: 1px solid rgba(169, 216, 216, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 42%),
    rgba(8, 22, 28, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.stage-info__heading {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.stage-info__marker {
  width: 10px;
  height: 48px;
  border-radius: 8px;
  background: var(--stage-accent, #8bd6c4);
  box-shadow: 0 0 26px color-mix(in srgb, var(--stage-accent, #8bd6c4), transparent 45%);
}

.stage-info__subtitle,
.stage-info__title,
.stage-info__description,
.stage-info__section-title {
  overflow-wrap: anywhere;
}

.stage-info__subtitle {
  margin: 0 0 5px;
  color: rgba(139, 214, 196, 0.84);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
}

.stage-info__title {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  line-height: 1.32;
  letter-spacing: 0;
}

.stage-info__description {
  margin: 0;
  color: rgba(237, 247, 246, 0.75);
  font-size: 14px;
  line-height: 1.75;
}

.stage-info__section {
  display: grid;
  gap: 9px;
}

.stage-info__section-title {
  margin: 0;
  color: rgba(237, 247, 246, 0.92);
  font-size: 13px;
  line-height: 1.4;
}

.stage-info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.stage-info__capabilities {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  color: rgba(237, 247, 246, 0.72);
  font-size: 13px;
  line-height: 1.55;
  list-style: none;
}

.stage-info__capabilities li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.stage-info__capabilities span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8bd6c4;
  box-shadow: 0 0 12px rgba(139, 214, 196, 0.8);
}

.stage-info__metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: auto;
}

.stage-info__metric {
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(169, 216, 216, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.stage-info__metric span,
.stage-info__metric strong {
  display: block;
  overflow-wrap: anywhere;
}

.stage-info__metric span {
  color: rgba(237, 247, 246, 0.58);
  font-size: 12px;
  line-height: 1.35;
}

.stage-info__metric strong {
  margin-top: 4px;
  color: #ffffff;
  font-size: 15px;
  line-height: 1.25;
}

@media (max-width: 430px) {
  .stage-info__metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
