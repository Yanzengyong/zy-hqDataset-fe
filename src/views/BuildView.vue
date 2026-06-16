<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BuildMetrics from '../components/build/BuildMetrics.vue'
import BuildScene from '../components/build/BuildScene.vue'
import FlowControls from '../components/build/FlowControls.vue'
import StageInfoPanel from '../components/build/StageInfoPanel.vue'
import LoadingState from '../components/common/LoadingState.vue'
import { getBuildOverview } from '../services/mockApi.js'

const PLAY_INTERVAL_MS = 2600

const stages = ref([])
const metrics = ref([])
const activeStageId = ref('')
const isPlaying = ref(true)
const loading = ref(true)
let playTimer = null

const activeStage = computed(() =>
  stages.value.find((stage) => stage.id === activeStageId.value) ?? stages.value[0] ?? null,
)

const clearPlayTimer = () => {
  if (playTimer) {
    window.clearInterval(playTimer)
    playTimer = null
  }
}

const advanceStage = () => {
  if (!stages.value.length) {
    return
  }

  const currentIndex = stages.value.findIndex((stage) => stage.id === activeStageId.value)
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % stages.value.length : 0
  activeStageId.value = stages.value[nextIndex].id
}

const syncAutoplay = () => {
  clearPlayTimer()

  if (isPlaying.value && stages.value.length > 1) {
    playTimer = window.setInterval(advanceStage, PLAY_INTERVAL_MS)
  }
}

const selectStage = (stageId) => {
  activeStageId.value = stageId
  isPlaying.value = false
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
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

watch([isPlaying, stages], syncAutoplay, { deep: true })

onUnmounted(() => {
  clearPlayTimer()
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
          :is-playing="isPlaying"
          @select-stage="selectStage"
        />
        <StageInfoPanel class="build-view__panel" :stage="activeStage" />
      </div>

      <FlowControls
        :stages="stages"
        :active-stage-id="activeStageId"
        :is-playing="isPlaying"
        @toggle-play="togglePlay"
        @select-stage="selectStage"
      />
    </template>
  </section>
</template>

<style scoped>
.build-view {
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 132px);
  padding: 24px;
  border-radius: 8px;
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
  gap: 16px;
  align-items: stretch;
  margin-top: 16px;
}

.build-view__scene,
.build-view__panel {
  min-width: 0;
}

@media (max-width: 980px) {
  .build-view__header,
  .build-view__workspace {
    grid-template-columns: 1fr;
  }

  .build-view__header {
    align-items: start;
  }
}

@media (max-width: 640px) {
  .build-view {
    min-height: calc(100vh - 96px);
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
