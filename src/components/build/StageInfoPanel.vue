<script setup>
import { computed } from 'vue'
import TagBadge from '../common/TagBadge.vue'

const props = defineProps({
  stage: {
    type: Object,
    default: null,
  },
  sourceAccessStatus: {
    type: String,
    default: 'idle',
  },
  collectStatus: {
    type: String,
    default: 'idle',
  },
  annotateStatus: {
    type: String,
    default: 'idle',
  },
  qualityStatus: {
    type: String,
    default: 'idle',
  },
  sourceProgress: {
    type: Number,
    default: 0,
  },
  collectProgress: {
    type: Number,
    default: 0,
  },
  qualityProgress: {
    type: Number,
    default: 0,
  },
})

const isSourceStage = computed(() => props.stage?.id === 'source')
const isCollectStage = computed(() => props.stage?.id === 'collect')
const isAnnotateStage = computed(() => props.stage?.id === 'annotate')
const isQualityStage = computed(() => props.stage?.id === 'quality')
const isProductStage = computed(() => props.stage?.id === 'product')
const isCompactConfigStage = computed(() =>
  isSourceStage.value ||
  isCollectStage.value ||
  isAnnotateStage.value ||
  isQualityStage.value ||
  isProductStage.value,
)
const isSourceLoading = computed(() => isSourceStage.value && props.sourceAccessStatus === 'loading')
const isSourceSuccess = computed(() => isSourceStage.value && props.sourceAccessStatus === 'success')
const isCollectLoading = computed(() => isCollectStage.value && props.collectStatus === 'loading')
const isCollectSuccess = computed(() => isCollectStage.value && props.collectStatus === 'success')
const isAnnotateLoading = computed(() => isAnnotateStage.value && props.annotateStatus === 'loading')
const isAnnotateSuccess = computed(() => isAnnotateStage.value && props.annotateStatus === 'success')
const isQualityLoading = computed(() => isQualityStage.value && props.qualityStatus === 'loading')
const isQualitySuccess = computed(() => isQualityStage.value && props.qualityStatus === 'success')

const qualityDownloadItems = ['问题样本清单', '质检报告', '修订建议']

const sourceTone = computed(() => {
  const toneMap = {
    source: 'green',
    collect: 'blue',
    annotate: 'gold',
    quality: 'cyan',
    product: 'default',
  }

  return toneMap[props.stage?.id] ?? 'default'
})

const accessStatusText = computed(() => {
  return '待接入'
})

const collectStatusText = computed(() => {
  return '待处理'
})

const smartAnnotateText = computed(() => {
  if (isAnnotateLoading.value) {
    return '智能标注中'
  }

  if (isAnnotateSuccess.value) {
    return '智能标注完成'
  }

  return '等待智能标注'
})

const qualityStatusText = computed(() => {
  return '待评估'
})

const itemSequenceIndex = (groupIndex, itemIndex) => {
  const previousItems = props.stage.configGroups
    .slice(0, groupIndex)
    .reduce((total, group) => total + group.items.length, 0)

  return previousItems + itemIndex
}

const isCurrentSourceItem = (index) => isSourceLoading.value && index === props.sourceProgress
const isDoneSourceItem = (index) => isSourceSuccess.value || index < props.sourceProgress
const isCurrentCollectItem = (index) => isCollectLoading.value && index === props.collectProgress
const isDoneCollectItem = (index) => isCollectSuccess.value || index < props.collectProgress
const isCurrentQualityItem = (index) => isQualityLoading.value && index === props.qualityProgress
const isDoneQualityItem = (index) => isQualitySuccess.value || index < props.qualityProgress

const sourceAccessText = (index) => {
  if (isCurrentSourceItem(index)) {
    return '接入中'
  }

  if (isDoneSourceItem(index)) {
    return '接入成功'
  }

  return accessStatusText.value
}

const assessmentValue = (item, index) => {
  if (isCurrentSourceItem(index)) {
    return '评估中'
  }

  if (isDoneSourceItem(index)) {
    return item.value
  }

  return '待评估'
}

const collectItemText = (index) => {
  if (isCurrentCollectItem(index)) {
    return '处理中'
  }

  if (isDoneCollectItem(index)) {
    return '完成'
  }

  return collectStatusText.value
}

const qualityItemText = (index) => {
  if (isCurrentQualityItem(index)) {
    return '评估中'
  }

  if (isDoneQualityItem(index)) {
    return '完成'
  }

  return qualityStatusText.value
}

const shouldShowQualityDownload = (group, item) =>
  isQualityStage.value &&
  group.label === '输出结果' &&
  qualityDownloadItems.includes(typeof item === 'string' ? item : item.label)

const productRevealDelay = (groupIndex, itemIndex) => {
  const previousItems = props.stage.configGroups
    .slice(0, groupIndex)
    .reduce((total, group) => total + group.items.length, 0)

  return `${(previousItems + itemIndex) * 110}ms`
}
</script>

<template>
  <section v-if="stage" class="stage-config" aria-label="当前模块配置项">
    <header class="stage-config__header">
      <div>
        <p class="stage-config__subtitle">{{ stage.subtitle }}</p>
        <h2 class="stage-config__title">{{ stage.configTitle || stage.title }}</h2>
      </div>
      <p class="stage-config__description">{{ stage.description }}</p>
    </header>

    <div
      class="stage-config__body"
      :class="{
        'stage-config__body--source': isSourceStage,
        'stage-config__body--collect': isCollectStage,
        'stage-config__body--annotate': isAnnotateStage,
        'stage-config__body--quality': isQualityStage,
        'stage-config__body--product': isProductStage,
      }"
    >
      <section v-if="!isCompactConfigStage" class="stage-config__block" aria-label="模块对象">
        <h3>模块对象</h3>
        <div class="stage-config__tags">
          <TagBadge v-for="item in stage.sourceTypes" :key="item" :tone="sourceTone">
            {{ item }}
          </TagBadge>
        </div>
      </section>

      <template
        v-for="(group, groupIndex) in stage.configGroups"
        :key="group.label"
      >
        <section class="stage-config__block">
          <div class="stage-config__block-head">
            <h3>{{ group.label }}</h3>
            <button
              v-if="isSourceStage && group.label === '接入范围'"
              class="stage-config__edit"
              type="button"
              disabled
              aria-disabled="true"
            >
              编辑
            </button>
            <button
              v-else-if="isCollectStage && ['采集方式', '清洗规则'].includes(group.label)"
              class="stage-config__edit"
              type="button"
              disabled
              aria-disabled="true"
            >
              编辑
            </button>
            <button
              v-else-if="isAnnotateStage && ['标注体系', '协同规则'].includes(group.label)"
              class="stage-config__edit"
              type="button"
              disabled
              aria-disabled="true"
            >
              编辑
            </button>
            <button
              v-else-if="isQualityStage && ['评估维度', '质检策略'].includes(group.label)"
              class="stage-config__edit"
              type="button"
              disabled
              aria-disabled="true"
            >
              编辑
            </button>
          </div>
          <ul>
            <li
              v-for="(item, itemIndex) in group.items"
              :key="typeof item === 'string' ? item : item.label"
              :class="{
                'stage-config__row--split': isCompactConfigStage,
                'stage-config__row--reveal': isProductStage,
              }"
              :style="isProductStage ? { '--reveal-delay': productRevealDelay(groupIndex, itemIndex) } : null"
            >
              <span class="stage-config__dot" aria-hidden="true"></span>
              <span class="stage-config__row-label">{{ typeof item === 'string' ? item : item.label }}</span>
              <span
                v-if="isSourceStage && group.label === '接入范围'"
                class="stage-config__status"
                :class="{
                  'stage-config__status--loading': isCurrentSourceItem(itemSequenceIndex(groupIndex, itemIndex)),
                  'stage-config__status--success': isDoneSourceItem(itemSequenceIndex(groupIndex, itemIndex)),
                }"
              >
                <i v-if="isCurrentSourceItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true"></i>
                <b v-else-if="isDoneSourceItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true">✓</b>
                {{ sourceAccessText(itemSequenceIndex(groupIndex, itemIndex)) }}
              </span>
              <span
                v-else-if="isSourceStage && group.label === '接入评估'"
                class="stage-config__status"
                :class="{
                  'stage-config__status--loading': isCurrentSourceItem(itemSequenceIndex(groupIndex, itemIndex)),
                  'stage-config__status--success': isDoneSourceItem(itemSequenceIndex(groupIndex, itemIndex)),
                }"
              >
                <i v-if="isCurrentSourceItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true"></i>
                <b v-else-if="isDoneSourceItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true">✓</b>
                {{ assessmentValue(item, itemSequenceIndex(groupIndex, itemIndex)) }}
              </span>
              <span
                v-else-if="isCollectStage"
                class="stage-config__status"
                :class="{
                  'stage-config__status--loading': isCurrentCollectItem(itemSequenceIndex(groupIndex, itemIndex)),
                  'stage-config__status--success': isDoneCollectItem(itemSequenceIndex(groupIndex, itemIndex)),
                }"
              >
                <i v-if="isCurrentCollectItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true"></i>
                <b v-else-if="isDoneCollectItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true">✓</b>
                {{ collectItemText(itemSequenceIndex(groupIndex, itemIndex)) }}
              </span>
              <span
                v-else-if="isQualityStage"
                class="stage-config__status"
                :class="{
                  'stage-config__status--loading': isCurrentQualityItem(itemSequenceIndex(groupIndex, itemIndex)),
                  'stage-config__status--success': isDoneQualityItem(itemSequenceIndex(groupIndex, itemIndex)),
                }"
              >
                <i v-if="isCurrentQualityItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true"></i>
                <button
                  v-else-if="
                    isDoneQualityItem(itemSequenceIndex(groupIndex, itemIndex)) &&
                    shouldShowQualityDownload(group, item)
                  "
                  class="stage-config__download"
                  type="button"
                  disabled
                  aria-disabled="true"
                >
                  下载
                </button>
                <b v-else-if="isDoneQualityItem(itemSequenceIndex(groupIndex, itemIndex))" aria-hidden="true">✓</b>
                <template
                  v-if="
                    !isDoneQualityItem(itemSequenceIndex(groupIndex, itemIndex)) ||
                    !shouldShowQualityDownload(group, item)
                  "
                >
                  {{ qualityItemText(itemSequenceIndex(groupIndex, itemIndex)) }}
                </template>
              </span>
            </li>
          </ul>
        </section>

        <div
          v-if="isAnnotateStage && group.label === '协同规则'"
          class="stage-config__smart-arrow"
          :class="{
            'stage-config__smart-arrow--loading': isAnnotateLoading,
            'stage-config__smart-arrow--success': isAnnotateSuccess,
          }"
          aria-label="智能标注中"
        >
          <span aria-hidden="true"></span>
          <strong>{{ smartAnnotateText }}</strong>
        </div>
      </template>

      <section v-if="!isCompactConfigStage" class="stage-config__metrics" aria-label="模块指标">
        <div v-for="metric in stage.metrics" :key="metric.label" class="stage-config__metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.stage-config {
  position: relative;
  z-index: 1;
  min-height: 260px;
  margin-top: 16px;
  padding: 18px;
  border: 1px solid rgba(169, 216, 216, 0.18);
  border-radius: 8px;
  background:
    radial-gradient(circle at 18% 0%, rgba(31, 138, 112, 0.18), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 42%),
    rgba(5, 14, 22, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.stage-config__header {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(280px, 1fr);
  gap: 18px;
  align-items: end;
  margin-bottom: 18px;
}

.stage-config__subtitle {
  margin: 0 0 6px;
  color: rgba(139, 214, 196, 0.84);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
}

.stage-config__title {
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  line-height: 1.3;
  letter-spacing: 0;
}

.stage-config__description {
  margin: 0;
  color: rgba(237, 247, 246, 0.72);
  font-size: 14px;
  line-height: 1.75;
}

.stage-config__body {
  display: grid;
  grid-template-columns: 1.05fr repeat(3, minmax(0, 1fr)) 0.9fr;
  gap: 12px;
  align-items: stretch;
}

.stage-config__body--source {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stage-config__body--collect {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stage-config__body--quality {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stage-config__body--product {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stage-config__body--annotate {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(150px, 190px) minmax(0, 1fr);
  align-items: center;
}

.stage-config__block,
.stage-config__metrics {
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(169, 216, 216, 0.14);
  border-radius: 8px;
  background: rgba(8, 22, 28, 0.6);
}

.stage-config__block-head {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stage-config__block h3 {
  margin: 0 0 10px;
  color: rgba(237, 247, 246, 0.92);
  font-size: 14px;
  line-height: 1.4;
}

.stage-config__block-head h3 {
  margin: 0;
}

.stage-config__edit {
  min-height: 28px;
  padding: 0 11px;
  border: 1px solid rgba(139, 214, 196, 0.28);
  border-radius: 6px;
  color: rgba(139, 214, 196, 0.82);
  background: rgba(31, 138, 112, 0.12);
  font-size: 12px;
  font-weight: 800;
  cursor: default;
}

.stage-config__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.stage-config__block ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  color: rgba(237, 247, 246, 0.72);
  font-size: 13px;
  line-height: 1.55;
  list-style: none;
}

.stage-config__block li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.stage-config__row--split {
  grid-template-columns: minmax(0, 1fr) minmax(96px, auto);
  column-gap: 18px;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid rgba(169, 216, 216, 0.08);
}

.stage-config__row--split:last-child {
  border-bottom: 0;
}

.stage-config__row--split .stage-config__dot {
  display: none;
}

.stage-config__row--reveal {
  opacity: 0;
  transform: translateY(8px);
  animation: stage-config-reveal 0.46s ease forwards;
  animation-delay: var(--reveal-delay, 0ms);
}

.stage-config__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8bd6c4;
  box-shadow: 0 0 12px rgba(139, 214, 196, 0.8);
}

.stage-config__row-label {
  position: relative;
  min-width: 0;
  padding-left: 14px;
  overflow-wrap: anywhere;
}

.stage-config__row--split .stage-config__row-label::before {
  position: absolute;
  left: 0;
  top: 0.68em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8bd6c4;
  box-shadow: 0 0 12px rgba(139, 214, 196, 0.8);
  content: '';
  transform: translateY(-50%);
}

.stage-config__status {
  display: inline-flex;
  min-width: 96px;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  color: rgba(237, 247, 246, 0.54);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
}

.stage-config__status i {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(139, 214, 196, 0.28);
  border-top-color: #8bd6c4;
  border-radius: 50%;
  animation: stage-config-spin 0.8s linear infinite;
}

.stage-config__status b {
  display: inline-grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border-radius: 50%;
  color: #062118;
  background: #54e38f;
  font-size: 11px;
  line-height: 1;
}

.stage-config__status--loading {
  color: rgba(139, 214, 196, 0.86);
}

.stage-config__status--success {
  color: #80f0ac;
}

.stage-config__download {
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid rgba(84, 227, 143, 0.35);
  border-radius: 6px;
  color: #80f0ac;
  background: rgba(84, 227, 143, 0.1);
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  cursor: default;
}

.stage-config__smart-arrow {
  position: relative;
  display: grid;
  min-height: 84px;
  align-content: center;
  justify-items: center;
  color: rgba(139, 214, 196, 0.92);
  font-size: 13px;
  font-weight: 900;
  line-height: 1.3;
  text-align: center;
}

.stage-config__smart-arrow::before,
.stage-config__smart-arrow::after {
  position: absolute;
  top: 50%;
  content: '';
  transform: translateY(-50%);
}

.stage-config__smart-arrow::before {
  left: 0;
  right: 16px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(139, 214, 196, 0.14), #8bd6c4, rgba(139, 214, 196, 0.14));
  box-shadow: 0 0 14px rgba(139, 214, 196, 0.58);
}

.stage-config__smart-arrow::after {
  right: 0;
  width: 0;
  height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 13px solid #8bd6c4;
  filter: drop-shadow(0 0 8px rgba(139, 214, 196, 0.72));
}

.stage-config__smart-arrow span {
  position: relative;
  z-index: 1;
  display: grid;
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
  place-items: center;
  border: 2px solid rgba(139, 214, 196, 0.28);
  border-radius: 50%;
  background: rgba(5, 14, 22, 0.92);
}

.stage-config__smart-arrow--loading span {
  border-width: 3px;
  border-top-color: #8bd6c4;
  animation: stage-config-spin 0.8s linear infinite;
}

.stage-config__smart-arrow--success span {
  border-color: #54e38f;
  background: #54e38f;
}

.stage-config__smart-arrow--success span::before {
  color: #062118;
  content: '✓';
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
}

.stage-config__smart-arrow strong {
  position: relative;
  z-index: 1;
  padding: 4px 9px;
  border: 1px solid rgba(139, 214, 196, 0.2);
  border-radius: 6px;
  background: rgba(5, 14, 22, 0.88);
  white-space: nowrap;
}

.stage-config__smart-arrow--success strong {
  color: #80f0ac;
  border-color: rgba(84, 227, 143, 0.28);
}

@keyframes stage-config-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes stage-config-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stage-config__metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.stage-config__metric {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid rgba(169, 216, 216, 0.13);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
}

.stage-config__metric span,
.stage-config__metric strong {
  display: block;
  overflow-wrap: anywhere;
}

.stage-config__metric span {
  color: rgba(237, 247, 246, 0.58);
  font-size: 12px;
  line-height: 1.35;
}

.stage-config__metric strong {
  margin-top: 4px;
  color: #ffffff;
  font-size: 15px;
  line-height: 1.25;
}

@media (max-width: 1120px) {
  .stage-config__body {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stage-config__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-column: 1 / -1;
  }
}

@media (max-width: 720px) {
  .stage-config__header,
  .stage-config__body,
  .stage-config__body--source,
  .stage-config__body--collect,
  .stage-config__body--annotate,
  .stage-config__body--quality,
  .stage-config__body--product,
  .stage-config__metrics {
    grid-template-columns: 1fr;
  }

  .stage-config__smart-arrow {
    min-height: 72px;
    transform: rotate(90deg);
  }

  .stage-config__smart-arrow strong {
    transform: rotate(-90deg);
  }
}
</style>
