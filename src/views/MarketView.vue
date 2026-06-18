<script setup>
import { onMounted, ref, watch } from 'vue'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import Breadcrumb from '../components/layout/Breadcrumb.vue'
import DatasetCard from '../components/market/DatasetCard.vue'
import DatasetSearchBar from '../components/market/DatasetSearchBar.vue'
import FilterSidebar from '../components/market/FilterSidebar.vue'
import marketCardImage from '../assets/market/tcm-market-card-bg.png'
import marketHeroImage from '../assets/market/tcm-market-hero.png'
import {
  getDatasets,
  getMarketCategories,
  toggleFavorite,
} from '../services/mockApi.js'

const breadcrumbItems = [
  {
    label: '首页',
    to: '/',
  },
  {
    label: '数据集专区',
  },
]

const marketCategories = ref([])
const datasets = ref([])
const keyword = ref('')
const activeCategory = ref('all')
const sort = ref('latest')
const loading = ref(true)
let datasetRequestId = 0

const loadDatasets = async () => {
  const requestId = datasetRequestId + 1
  datasetRequestId = requestId
  loading.value = true

  try {
    const results = await getDatasets({
      keyword: keyword.value,
      category: activeCategory.value,
      sort: sort.value,
    })

    if (requestId === datasetRequestId) {
      datasets.value = results
    }
  } finally {
    if (requestId === datasetRequestId) {
      loading.value = false
    }
  }
}

const selectCategory = (category) => {
  activeCategory.value = category
}

const toggleDatasetFavorite = async (id) => {
  const updatedDataset = await toggleFavorite(id)

  if (!updatedDataset) {
    return
  }

  datasets.value = datasets.value.map((dataset) =>
    dataset.id === id ? updatedDataset : dataset,
  )
}

onMounted(async () => {
  marketCategories.value = await getMarketCategories()
  await loadDatasets()
})

watch([keyword, activeCategory, sort], () => {
  loadDatasets()
})
</script>

<template>
  <section
    class="market-view"
    aria-labelledby="market-page-title"
    :style="{ '--market-hero-image': `url(${marketHeroImage})` }"
  >
    <header class="market-view__header">
      <Breadcrumb :items="breadcrumbItems" />
      <div
        class="market-view__heading"
        :style="{ '--market-card-image': `url(${marketCardImage})` }"
      >
        <div>
          <p class="market-view__eyebrow">数据集专区</p>
          <h1 id="market-page-title">数据集超市</h1>
        </div>
        <p>
          汇集中医文本、影像、临床与知识资产数据集，支持按目录、关键词和业务指标快速筛选。
        </p>
      </div>
    </header>

    <div class="market-view__layout">
      <FilterSidebar
        class="market-view__sidebar"
        :categories="marketCategories"
        :active-category="activeCategory"
        @select-category="selectCategory"
      />

      <main class="market-view__content" aria-label="数据集列表">
        <DatasetSearchBar
          v-model="keyword"
          :sort="sort"
          @search="loadDatasets"
          @update:sort="sort = $event"
        />

        <div class="market-view__list-meta" aria-live="polite">
          <span>共 {{ datasets.length }} 个数据集</span>
          <span v-if="activeCategory !== 'all'">当前筛选：{{ activeCategory }}</span>
        </div>

        <div class="market-view__body">
          <div v-if="loading" class="market-view__loading">
            <LoadingState text="正在载入数据集..." />
          </div>

          <EmptyState
            v-else-if="!datasets.length"
            title="暂无匹配数据集"
            description="请调整关键词、目录筛选或排序条件后再试。"
          />

          <div v-else class="market-view__cards">
            <DatasetCard
              v-for="dataset in datasets"
              :key="dataset.id"
              :dataset="dataset"
              @toggle-favorite="toggleDatasetFavorite"
            />
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
.market-view {
  --color-blue: #218a79;
  --color-blue-deep: #0d675d;
  --color-teal: #1f8d7a;
  --color-green: #4b7d3a;
  --color-gold: #b68a37;
  --color-border: #d5e3d8;
  --color-border-strong: #afcbb8;
  --color-panel: #fffdf6;
  --color-panel-subtle: #f3f8ee;
  --color-page: #edf5ef;
  --color-muted: #66766f;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 18px;
  height: calc(100vh - 80px);
  padding: 16px 24px 24px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(237, 245, 239, 0.9), rgba(237, 245, 239, 0.78)),
    linear-gradient(90deg, rgba(237, 245, 239, 0.92) 0%, rgba(237, 245, 239, 0.74) 46%, rgba(237, 245, 239, 0.54) 100%),
    var(--market-hero-image) center / cover no-repeat,
    var(--color-page);
  background-attachment: local;
}

.market-view__header {
  display: grid;
  gap: 12px;
}

.market-view__heading {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 20px;
  align-items: end;
  min-height: 118px;
  padding: 26px 28px;
  overflow: hidden;
  border: 0;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 253, 246, 0.58) 44%, rgba(255, 253, 246, 0.38) 100%),
    var(--market-card-image) center / cover no-repeat,
    var(--color-panel);
  box-shadow:
    0 18px 40px rgba(23, 74, 61, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.market-view__heading::before {
  display: none;
}

.market-view__heading::after {
  position: absolute;
  right: 34px;
  bottom: 20px;
  z-index: -1;
  width: 112px;
  height: 112px;
  border: 1px solid rgba(13, 103, 93, 0.16);
  border-radius: 50%;
  background:
    linear-gradient(90deg, transparent 47%, rgba(13, 103, 93, 0.14) 48% 52%, transparent 53%),
    linear-gradient(0deg, transparent 47%, rgba(13, 103, 93, 0.14) 48% 52%, transparent 53%);
  opacity: 0.35;
  content: "";
}

.market-view__eyebrow {
  margin: 0 0 7px;
  color: #2b7c69;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.4;
}

.market-view__heading h1 {
  margin: 0;
  color: #0d554c;
  font-family: inherit;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.22;
  letter-spacing: 0;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}

.market-view__heading p {
  margin: 0;
  color: #526963;
  font-size: 14px;
  line-height: 1.75;
  white-space: nowrap;
}

.market-view__layout {
  display: grid;
  grid-template-columns: 252px minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
  min-height: 0;
}

.market-view__sidebar {
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.market-view__sidebar :deep(.filter-sidebar) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.market-view__sidebar :deep(.filter-sidebar__groups) {
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(13, 148, 136, 0.3) transparent;
}

.market-view__sidebar :deep(.filter-sidebar__groups::-webkit-scrollbar) {
  width: 6px;
}

.market-view__sidebar :deep(.filter-sidebar__groups::-webkit-scrollbar-thumb) {
  background-color: rgba(13, 148, 136, 0.3);
  border-radius: 3px;
}

.market-view__content {
  min-width: 0;
  min-height: 0;
  padding: 18px;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 253, 246, 0.96), rgba(244, 250, 240, 0.94)),
    rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 34px rgba(23, 74, 61, 0.07);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.market-view__list-meta {
  flex: 0 0 auto;
}

.market-view__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(13, 148, 136, 0.3) transparent;
}

.market-view__body::-webkit-scrollbar {
  width: 6px;
}

.market-view__body::-webkit-scrollbar-track {
  background: transparent;
}

.market-view__body::-webkit-scrollbar-thumb {
  background-color: rgba(13, 148, 136, 0.3);
  border-radius: 3px;
}

.market-view__body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(13, 148, 136, 0.55);
}

.market-view__list-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  margin: 14px 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.5;
}

.market-view__loading {
  display: grid;
  min-height: 240px;
  place-items: center;
}

.market-view__cards {
  display: grid;
  gap: 12px;
}

@media (max-width: 900px) {
  .market-view__heading,
  .market-view__layout {
    grid-template-columns: 1fr;
  }

  .market-view__sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .market-view {
    min-height: calc(100vh - 80px - 32px);
    padding: 16px;
  }

  .market-view__heading,
  .market-view__content {
    padding: 16px;
  }

  .market-view__heading h1 {
    font-size: 24px;
  }
}
</style>
