<script setup>
import { onMounted, ref, watch } from 'vue'
import AnimatedBackground from '../components/common/AnimatedBackground.vue'
import DatasetCard from '../components/market/DatasetCard.vue'
import LoadingState from '../components/common/LoadingState.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { getDatasetsByCategory, toggleFavorite } from '../services/mockApi.js'

const activeTab = ref('herb')
const datasets = ref([])
const loading = ref(true)

const tabs = [
  { key: 'herb', label: '药材数据集' },
  { key: 'classic', label: '古籍数据集' },
  { key: 'clinical', label: '诊疗数据集' },
]

const loadDatasets = async () => {
  loading.value = true
  try {
    datasets.value = await getDatasetsByCategory(activeTab.value)
  } finally {
    loading.value = false
  }
}

const handleToggleFavorite = async (id) => {
  const updatedDataset = await toggleFavorite(id)
  if (!updatedDataset) return
  
  datasets.value = datasets.value.map(dataset => 
    dataset.id === id ? updatedDataset : dataset
  )
}

onMounted(loadDatasets)

watch(activeTab, loadDatasets)
</script>

<template>
  <AnimatedBackground />
  <div class="home-content">
    <div class="content-wrapper">
      <div class="header-section">
        <div class="header-title">
          <h3 class="title">中医药（苗药）数据集构建流程</h3>
          <!-- <p class="sub-title">赋能大模型的预训练、微调和评测</p> -->
        </div>
        <video src="/video/banner_zh.mp4" width="80%" autoplay muted loop class="welcome-video"></video>
      </div>
    </div>

    <div class="content-product">
      <h2 class="content-product__title">数据集产品</h2>
      
      <div class="content-product__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="content-product__tab"
          :class="{ 'is-active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="content-product__panel">
        <div v-if="loading" class="content-product__loading">
          <LoadingState text="正在载入数据集..." />
        </div>
        
        <EmptyState
          v-else-if="!datasets.length"
          title="暂无数据集"
          description="该类别下暂无数据集，请切换其他类别查看。"
        />
        
        <div v-else class="content-product__list">
          <DatasetCard
            v-for="dataset in datasets"
            :key="dataset.id"
            :dataset="dataset"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-content {
  height: calc(100vh - 80px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(39, 92, 160, 0.3) transparent;
}

.home-content::-webkit-scrollbar {
  width: 6px;
}

.home-content::-webkit-scrollbar-track {
  background: transparent;
}

.home-content::-webkit-scrollbar-thumb {
  background-color: rgba(39, 92, 160, 0.3);
  border-radius: 3px;
}

.home-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(39, 92, 160, 0.55);
}

.home-content::-webkit-scrollbar-thumb:active {
  background-color: rgba(39, 92, 160, 0.75);
}

.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 100vw;
  width: 100vw;
  box-sizing: border-box;
  background-color: black;
}

.header-section {
  position: relative;
  animation: slideDown 0.8s ease-out;
  width: 100vw;
  text-align: center;
  background-color: black;
}

.header-title{
  position: absolute;
  top: 7rem;
  left: 50%;
  text-align: center;
  transform: translateX(-50%);
}

.header-title .title{
  font-size: 2rem;
  line-height: 2.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0px 0px 16px 0;
}
.header-title .sub-title{
  font-size: 1.5rem;
  line-height: 2rem;
  color: hsla(0, 0%, 100%, .6);
}

.welcome-video {
  margin: 0 auto;
}

.content-product {
  position: relative;
  z-index: 2;
  margin-top: 30px;
  padding: 0 15%;
  text-align: center;
}

.content-product__title {
  margin: 0 0 24px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-ink);
}

.content-product__tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.content-product__tab {
  padding: 10px 24px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-panel);
  color: var(--color-muted);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.content-product__tab:hover {
  color: var(--color-ink);
  border-color: var(--color-border-strong);
}

.content-product__tab.is-active {
  color: var(--color-blue-deep);
  background: rgba(39, 92, 160, 0.08);
  border-color: rgba(39, 92, 160, 0.3);
  font-weight: 600;
}

.content-product__panel {
  min-height: 200px;
  padding: 32px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-panel);
}

.content-product__loading {
  display: grid;
  min-height: 200px;
  place-items: center;
}

.content-product__list {
  display: grid;
  gap: 16px;
}

@media (max-width: 768px) {
  .content-product {
    padding: 0 5%;
  }
  
  .content-product__panel {
    padding: 16px;
  }
}
</style>