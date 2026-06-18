<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import DatasetGridCard from '../components/market/DatasetGridCard.vue'
import LoadingState from '../components/common/LoadingState.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { getDatasetsByCategory, toggleFavorite } from '../services/mockApi.js'
import homeBackground from '../assets/home/tcm-home-bg.png'
import marketCardImage from '../assets/market/tcm-market-card-bg.png'
import marketHeroImage from '../assets/market/tcm-market-hero.png'

const activeTab = ref('herb')
const datasets = ref([])
const loading = ref(true)

const tabs = [
  { key: 'herb', label: '药材数据集', bg: marketCardImage },
  { key: 'classic', label: '古籍数据集', bg: homeBackground },
  { key: 'clinical', label: '诊疗数据集', bg: marketHeroImage },
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
  <div
    class="home-content page-scrollbar"
    :style="{ '--home-bg-image': `url(${homeBackground})` }"
  >

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
  position: relative;
  background:
    linear-gradient(180deg, rgba(237, 245, 239, 0.86), rgba(237, 245, 239, 0.74)),
    linear-gradient(90deg, rgba(255, 253, 246, 0.88), rgba(237, 245, 239, 0.64)),
    var(--home-bg-image) top center / 100% 680px no-repeat,
    #edf5ef;
}

.header-box {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(255, 253, 246, 0.48), rgba(255, 253, 246, 0.7)),
      radial-gradient(720px 220px at 50% 14%, rgba(31, 141, 122, 0.14), transparent 70%);
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
  background: transparent;
  margin-bottom: 40px;
}

.header-title {
  text-align: center;
  .title {
    font-size: 2rem;
    line-height: 7rem;
    height: 7rem;
    font-weight: 700;
    color: #173f36;
  }

  .sub-title {
    font-size: 1.3rem;
    line-height: 2rem;
    color: #60746a;
  }
}

.welcome-video {
  display: block;
  width: 80%;
  margin: 0 auto;
  opacity: 1;
  border-radius: 8px;
  background: rgba(255, 253, 246, 0.44);
  box-shadow: 0 18px 42px rgba(23, 74, 61, 0.08);
}

.content-product {
  position: relative;
  z-index: 2;
  overflow: hidden;
  padding: 100px 15% 20px;
  text-align: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: local;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      linear-gradient(180deg, rgba(255, 253, 246, 0.82), rgba(237, 245, 239, 0.78)),
      radial-gradient(760px 220px at 50% 10%, rgba(182, 138, 55, 0.08), transparent 70%);
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
    color: #173f36;
  }

  &__tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__tab {
    padding: 10px 24px;
    border: 1px solid rgba(31, 141, 122, 0.18);
    border-radius: 8px;
    background: rgba(255, 253, 246, 0.62);
    color: #66766f;
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms ease;

    &:hover {
      color: #173f36;
      border-color: rgba(31, 141, 122, 0.32);
      background: rgba(255, 253, 246, 0.84);
    }

    &.is-active {
      color: #0d675d;
      background: rgba(31, 141, 122, 0.12);
      border-color: rgba(31, 141, 122, 0.35);
      box-shadow: inset 0 0 0 1px rgba(31, 141, 122, 0.06);
      font-weight: 600;
    }
  }

  &__panel {
    min-height: 800px;
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
