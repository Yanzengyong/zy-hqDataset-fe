<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BuildMetrics from '../components/build/BuildMetrics.vue'
import BuildScene from '../components/build/BuildScene.vue'
import FlowControls from '../components/build/FlowControls.vue'
import StageInfoPanel from '../components/build/StageInfoPanel.vue'
import LoadingState from '../components/common/LoadingState.vue'
import { getBuildOverview } from '../services/mockApi.js'

const GOVERN_INTERVAL_MS = 2600
const ITEM_STEP_INTERVAL_MS = 720
const STAGE_ADVANCE_DELAY_MS = 520
const ANNOTATE_STAGE_DURATION_MS = 5500

const stages = ref([])
const metrics = ref([])
const activeStageId = ref('')
const isGoverning = ref(false)
const sourceAccessStatus = ref('idle')
const collectStatus = ref('idle')
const annotateStatus = ref('idle')
const qualityStatus = ref('idle')
const sourceProgress = ref(0)
const collectProgress = ref(0)
const qualityProgress = ref(0)
const loading = ref(true)
let governTimer = null
let governIndex = 0

const activeStage = computed(() =>
  stages.value.find((stage) => stage.id === activeStageId.value) ?? stages.value[0] ?? null,
)

const clearGovernTimer = () => {
  if (governTimer) {
    window.clearTimeout(governTimer)
    governTimer = null
  }
}

const selectStage = (stageId) => {
  activeStageId.value = stageId
  isGoverning.value = false
  clearGovernTimer()
}

const completeGovernance = () => {
  clearGovernTimer()
  isGoverning.value = false
}

const advanceGovernance = () => {
  governIndex += 1

  if (governIndex >= stages.value.length) {
    completeGovernance()
    return
  }

  runGovernanceStep()
}

const getStageItemCount = (stage) =>
  stage.configGroups?.reduce((total, group) => total + group.items.length, 0) ?? 0

const runSequentialStage = ({ stage, status, progress, duration = ITEM_STEP_INTERVAL_MS }) => {
  const total = getStageItemCount(stage)
  status.value = 'loading'
  progress.value = 0

  const runNextItem = () => {
    if (progress.value >= total) {
      status.value = 'success'
      governTimer = window.setTimeout(advanceGovernance, STAGE_ADVANCE_DELAY_MS)
      return
    }

    governTimer = window.setTimeout(() => {
      progress.value += 1
      runNextItem()
    }, duration)
  }

  runNextItem()
}

function runGovernanceStep() {
  const currentStage = stages.value[governIndex]

  if (!currentStage) {
    completeGovernance()
    return
  }

  activeStageId.value = currentStage.id

  if (currentStage.id === 'source') {
    runSequentialStage({
      stage: currentStage,
      status: sourceAccessStatus,
      progress: sourceProgress,
    })
    return
  }

  if (currentStage.id === 'collect') {
    runSequentialStage({
      stage: currentStage,
      status: collectStatus,
      progress: collectProgress,
    })
    return
  }

  if (currentStage.id === 'annotate') {
    annotateStatus.value = 'loading'
    governTimer = window.setTimeout(() => {
      annotateStatus.value = 'success'
      governTimer = window.setTimeout(advanceGovernance, STAGE_ADVANCE_DELAY_MS)
    }, ANNOTATE_STAGE_DURATION_MS)
    return
  }

  if (currentStage.id === 'quality') {
    runSequentialStage({
      stage: currentStage,
      status: qualityStatus,
      progress: qualityProgress,
    })
    return
  }

  governTimer = window.setTimeout(advanceGovernance, GOVERN_INTERVAL_MS)
}

const startGovernance = () => {
  if (isGoverning.value || stages.value.length === 0) {
    return
  }

  clearGovernTimer()
  isGoverning.value = true
  sourceAccessStatus.value = 'idle'
  collectStatus.value = 'idle'
  annotateStatus.value = 'idle'
  qualityStatus.value = 'idle'
  sourceProgress.value = 0
  collectProgress.value = 0
  qualityProgress.value = 0
  governIndex = 0
  runGovernanceStep()
}

onMounted(async () => {
  loading.value = true

  try {
    const overview = await getBuildOverview()
    metrics.value = overview.buildMetrics
    stages.value = overview.buildStages
    activeStageId.value = overview.buildStages[0]?.id ?? ''
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  clearGovernTimer()
})
</script>

<template>
  <section class="build-view" aria-labelledby="build-page-title">
    <header class="build-view__header">
      <div>
        <p class="build-view__eyebrow">高质量数据集构建流</p>
        <h1 id="build-page-title" class="build-view__title">中医药数据治理全流程</h1>
      </div>
      <p class="build-view__summary">
        从多源接入、采集清洗、专业标注到产品化交付，呈现可信、可追溯、可复用的数据集生产链路。
      </p>
    </header>

    <div v-if="loading" class="build-view__loading">
      <LoadingState text="正在载入构建流程..." />
    </div>

    <template v-else>
      <BuildMetrics :metrics="metrics" />

      <div class="build-view__workspace">
        <BuildScene
          class="build-view__scene"
          :stages="stages"
          :active-stage-id="activeStageId"
          :is-playing="isGoverning"
          @select-stage="selectStage"
        />
      </div>

      <FlowControls
        :stages="stages"
        :active-stage-id="activeStageId"
        :is-governing="isGoverning"
        @start-governance="startGovernance"
        @select-stage="selectStage"
      />

      <StageInfoPanel
        :stage="activeStage"
        :source-access-status="sourceAccessStatus"
        :collect-status="collectStatus"
        :annotate-status="annotateStatus"
        :quality-status="qualityStatus"
        :source-progress="sourceProgress"
        :collect-progress="collectProgress"
        :quality-progress="qualityProgress"
      />
    </template>
  </section>
</template>

<style scoped>
.build-view {
  position: relative;
  overflow: hidden;
  /* min-height: calc(100vh - 80px - 48px); */
  min-height: calc(100vh - 80px);
  padding: 24px;
  /* border-radius: 8px; */
  color: #edf7f6;
  background:
    radial-gradient(circle at 22% 12%, rgba(31, 138, 112, 0.24), transparent 32%),
    radial-gradient(circle at 76% 0%, rgba(47, 111, 187, 0.22), transparent 30%),
    linear-gradient(135deg, #071116 0%, #0b1722 47%, #10131b 100%);
}

.build-view::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(rgba(237, 247, 246, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(237, 247, 246, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.75), transparent 82%);
}

.build-view__header,
.build-view__workspace,
.build-view__loading {
  position: relative;
  z-index: 1;
}

.build-view__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 440px);
  gap: 24px;
  align-items: end;
  margin-bottom: 18px;
}

.build-view__eyebrow {
  margin: 0 0 8px;
  color: #8bd6c4;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.build-view__title {
  margin: 0;
  color: #ffffff;
  font-size: 28px;
  line-height: 1.22;
  letter-spacing: 0;
}

.build-view__summary {
  margin: 0;
  color: rgba(237, 247, 246, 0.72);
  font-size: 14px;
  line-height: 1.8;
}

.build-view__loading {
  display: grid;
  min-height: 320px;
  place-items: center;
}

.build-view__workspace {
  margin-top: 16px;
}

.build-view__scene {
  min-width: 0;
}

@media (max-width: 980px) {
  .build-view__header {
    grid-template-columns: 1fr;
  }

  .build-view__header {
    align-items: start;
  }
}

@media (max-width: 640px) {
  .build-view {
    min-height: calc(100vh - 80px - 32px);
    padding: 16px;
    border-radius: 8px;
  }

  .build-view__summary {
    font-size: 13px;
  }

  .build-view__title {
    font-size: 24px;
  }
}
</style>
