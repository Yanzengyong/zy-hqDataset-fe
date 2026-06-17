<script setup>
import { onMounted, ref, watch } from 'vue'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import Breadcrumb from '../components/layout/Breadcrumb.vue'
import DatasetCard from '../components/market/DatasetCard.vue'
import DatasetSearchBar from '../components/market/DatasetSearchBar.vue'
import FilterSidebar from '../components/market/FilterSidebar.vue'
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
  <section class="market-view" aria-labelledby="market-page-title">
    <header class="market-view__header">
      <Breadcrumb :items="breadcrumbItems" />
      <div class="market-view__heading">
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
      </main>
    </div>
  </section>
</template>

<style scoped>
.market-view {
  display: grid;
  gap: 18px;
  min-height: calc(100vh - 80px - 48px);
  height: calc(100vh - 80px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(39, 92, 160, 0.3) transparent;
}

.market-view::-webkit-scrollbar {
  width: 6px;
}

.market-view::-webkit-scrollbar-track {
  background: transparent;
}

.market-view::-webkit-scrollbar-thumb {
  background-color: rgba(39, 92, 160, 0.3);
  border-radius: 3px;
}

.market-view::-webkit-scrollbar-thumb:hover {
  background-color: rgba(39, 92, 160, 0.55);
}

.market-view::-webkit-scrollbar-thumb:active {
  background-color: rgba(39, 92, 160, 0.75);
}

.market-view__header {
  display: grid;
  gap: 12px;
}

.market-view__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 420px);
  gap: 20px;
  align-items: end;
  padding: 22px 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-panel);
  box-shadow: 0 12px 30px rgba(24, 36, 51, 0.05);
}

.market-view__eyebrow {
  margin: 0 0 7px;
  color: var(--color-teal);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.market-view__heading h1 {
  margin: 0;
  color: var(--color-ink);
  font-size: 28px;
  line-height: 1.22;
  letter-spacing: 0;
}

.market-view__heading p {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.75;
}

.market-view__layout {
  display: grid;
  grid-template-columns: 252px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.market-view__sidebar {
  position: sticky;
  top: 16px;
}

.market-view__content {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 30px rgba(24, 36, 51, 0.05);
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
