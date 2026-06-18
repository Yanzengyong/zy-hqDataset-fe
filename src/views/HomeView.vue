<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import DatasetGridCard from '../components/market/DatasetGridCard.vue'
import LoadingState from '../components/common/LoadingState.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { getDatasetsByCategory, toggleFavorite } from '../services/mockApi.js'

const activeTab = ref('herb')
const datasets = ref([])
const loading = ref(true)

const tabs = [
  { key: 'herb', label: '药材数据集', bg: '/images/zyy-01.png' },
  { key: 'classic', label: '古籍数据集', bg: '/images/zyy-02.png' },
  { key: 'clinical', label: '诊疗数据集', bg: '/images/zyy-03.png' },
]

const activeTabBg = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value)
  return tab ? `url(${tab.bg})` : 'none'
})

const loadDatasets = async () => {
  loading.value = true
  try {
    datasets.value = await getDatasetsByCategory(activeTab.value, 9)
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
  <!-- <AnimatedBackground /> -->
  <div class="home-content page-scrollbar">

    <div class="header-box">
      <div class="header-title">
        <h3 class="title">中医药（苗药）数据集构建流程</h3>
        <p class="sub-title">赋能大模型的预训练、微调和评测</p>
      </div>
      <div class="content-wrapper">
        <div class="header-section">
          <img src="/images/index-00.png" alt="" class="welcome-video" />
        </div>
      </div>
    </div>

    <div class="content-product" :style="{ backgroundImage: activeTabBg }">
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
          <DatasetGridCard
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

<style lang="scss" scoped>
.home-content {
  height: calc(100vh - 80px);
  overflow-y: scroll;
  overflow-x: hidden;
  background-image: url('/images/index-05.png');
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 100% 400px;
  position: relative;
}

.header-box {

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
}

.content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

.header-section {
  position: relative;
  animation: slideDown 0.8s ease-out;
  width: 100%;
  text-align: center;
}

.header-title {
  text-align: center;
  .title {
    font-size: 2rem;
    line-height: 7rem;
    height: 7rem;
    font-weight: 700;
    color: #4b4b4b;
  }

  .sub-title {
    font-size: 1.3rem;
    line-height: 2rem;
    color: #838383;
  }
}

.welcome-video {
  display: block;
  width: 80%;
  margin: 0 auto;
  opacity: 1;
  background: rgba(255, 255, 255, 0.7);
}

.content-product {
  margin-top: 30px;
  position: relative;
  z-index: 2;
  overflow: hidden;
  padding: 100px 15% 20px;
  text-align: center;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: rgba(255, 255, 255, 0.8);
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  &__title {
    margin: 0 0 60px;
    font-size: 40px;
    font-weight: 700;
    color: var(--color-ink);
  }

  &__tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__tab {
    padding: 10px 24px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.4);
    color: var(--color-muted);
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms ease;

    &:hover {
      color: var(--color-ink);
      border-color: var(--color-border-strong);
    }

    &.is-active {
      color: var(--color-blue-deep);
      background: rgba(234, 234, 235, 0.5);
      border-color: rgba(39, 92, 160, 0.3);
      font-weight: 600;
    }
  }

  &__panel {
    min-height: 1120px;
    padding: 32px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.5);
  }

  &__loading {
    display: grid;
    min-height: 200px;
    place-items: center;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .header-title {
    top: 1.5rem;
    width: 90%;

    .title {
      font-size: 1.5rem;
      line-height: 2rem;
    }
  }

  .content-product {
    padding: 0 5%;

    &__panel {
      min-height: 900px;
      padding: 16px;
    }
  }
}
</style>
