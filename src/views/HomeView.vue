<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { BookOpen, Leaf, Stethoscope } from 'lucide-vue-next'
import HomeFlowAnimation from '../components/home/HomeFlowAnimation.vue'
import DatasetGridCard from '../components/market/DatasetGridCard.vue'
import LoadingState from '../components/common/LoadingState.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { getDatasetsByCategory } from '../services/mockApi.js'
import { getDatasetCover } from '../utils/datasetCovers.js'
import homeBackground from '../assets/home/tcm-home-bg.png'
import marketCardImage from '../assets/market/tcm-market-card-bg.png'
import marketHeroImage from '../assets/market/tcm-market-hero.png'

const homeFlowImage = `${import.meta.env.BASE_URL}images/index-00.png`

const activeTab = ref('herb')
const datasets = ref([])
const loading = ref(true)

const tabs = [
  { key: 'herb', label: '药材数据集', bg: marketCardImage, icon: Leaf },
  { key: 'classic', label: '古籍数据集', bg: homeBackground, icon: BookOpen },
  { key: 'clinical', label: '诊疗数据集', bg: marketHeroImage, icon: Stethoscope },
]

const activeTabBg = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value)
  return tab ? `url(${tab.bg})` : 'none'
})

const loadDatasets = async () => {
  loading.value = true
  try {
    const categoryDatasets = await getDatasetsByCategory(activeTab.value, 9)
    datasets.value = categoryDatasets.sort(
      (first, second) => new Date(second.updatedAt) - new Date(first.updatedAt),
    )
  } finally {
    loading.value = false
  }
}

onMounted(loadDatasets)

watch(activeTab, loadDatasets)
</script>

<template>
  <div
    class="home-content page-scrollbar"
    :style="{ '--home-bg-image': `url(${homeBackground})` }"
  >

    <div class="header-box">
      <!-- <div class="herb-line herb-line--left" aria-hidden="true"></div>
      <div class="herb-line herb-line--right" aria-hidden="true"></div> -->
      <div class="data-meridian" aria-hidden="true">
        <span v-for="index in 18" :key="index"></span>
      </div>
      <div class="header-title">
        <h1 class="title">中医药（苗药）高质量数据集构建</h1>
        <p class="eyebrow">TCM DATA ENGINEERING PLATFORM</p>
        <p class="sub-title">汇聚药材图谱、古籍文献、诊疗知识与方剂处方，赋能大模型预训练、微调和评测</p>
      </div>
      <div class="content-wrapper">
        <div class="header-section">
          <HomeFlowAnimation />
        </div>
      </div>
    </div>

    <div class="content-product" :style="{ backgroundImage: activeTabBg }">
      <h2 class="content-product__title">数据集产品</h2>
      <p class="content-product__eyebrow">精选中医药数据资产</p>
      <div class="content-product__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="content-product__tab"
          :class="{ 'is-active': activeTab === tab.key }"
          type="button"
          @click="activeTab = tab.key"
        >
          <component :is="tab.icon" :size="20" stroke-width="1.9" aria-hidden="true" />
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
            :image-src="getDatasetCover(dataset)"
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
    radial-gradient(circle at 12% 12%, rgba(182, 138, 55, 0.14), transparent 28%),
    radial-gradient(circle at 88% 16%, rgba(31, 141, 122, 0.13), transparent 32%),
    linear-gradient(180deg, rgba(255, 253, 246, 0.93), rgba(237, 245, 239, 0.78)),
    linear-gradient(90deg, rgba(255, 253, 246, 0.9), rgba(237, 245, 239, 0.66)),
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
      linear-gradient(180deg, rgba(255, 253, 246, 0.54), rgba(255, 253, 246, 0.76)),
      radial-gradient(900px 260px at 50% 12%, rgba(31, 141, 122, 0.16), transparent 72%),
      repeating-linear-gradient(90deg, rgba(23, 74, 61, 0.035) 0 1px, transparent 1px 90px);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.42;
    background-image:
      radial-gradient(circle at 14% 30%, rgba(23, 74, 61, 0.12) 0 1px, transparent 2px),
      radial-gradient(circle at 72% 20%, rgba(182, 138, 55, 0.16) 0 1px, transparent 2px),
      radial-gradient(circle at 80% 66%, rgba(31, 141, 122, 0.13) 0 1px, transparent 2px);
    background-size: 110px 110px, 150px 150px, 130px 130px;
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
  animation: hero-rise 0.8s ease-out both;
  width: 100%;
  text-align: center;
  background: transparent;
  margin-bottom: 54px;
}

.header-title {
  position: relative;
  text-align: center;
  width: min(1080px, calc(100% - 32px));
  margin: 0 auto;
  padding: 66px 0 26px;

  .eyebrow {
    margin: 0 0 14px;
    color: #946b20;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .title {
    margin: 0;
    font-size: clamp(32px, 3.2vw, 54px);
    line-height: 1.18;
    font-weight: 700;
    color: #123c32;
    text-shadow: 0 12px 34px rgba(23, 74, 61, 0.12);
  }

  .sub-title {
    width: 100%;
    margin: 18px auto 0;
    font-size: clamp(16px, 1.25vw, 22px);
    line-height: 1.7;
    color: #5d7267;
  }
}

.herb-line {
  position: absolute;
  z-index: 0;
  width: 220px;
  height: 390px;
  opacity: 0.2;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 1px solid rgba(18, 83, 64, 0.48);
    border-width: 0 1px 0 0;
    border-radius: 50%;
    transform: rotate(24deg);
  }

  &::before {
    inset: 0 72px 0 72px;
  }

  &::after {
    inset: 42px 34px 82px 108px;
    box-shadow:
      -34px 70px 0 -28px rgba(18, 83, 64, 0.5),
      34px 118px 0 -27px rgba(18, 83, 64, 0.45),
      -24px 178px 0 -28px rgba(18, 83, 64, 0.5);
  }
}

.herb-line--left {
  left: 5%;
  top: 112px;
}

.herb-line--right {
  right: 4%;
  top: 42px;
  transform: scaleX(-1) rotate(-6deg);
}

.data-meridian {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  span {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(31, 141, 122, 0.22);
    box-shadow: 0 0 16px rgba(31, 141, 122, 0.24);
    animation: meridian-glow 5s ease-in-out infinite;
  }

  span:nth-child(3n + 1) {
    background: rgba(182, 138, 55, 0.26);
  }

  span:nth-child(1) { left: 12%; top: 18%; animation-delay: 0s; }
  span:nth-child(2) { left: 22%; top: 34%; animation-delay: .3s; }
  span:nth-child(3) { left: 30%; top: 22%; animation-delay: .6s; }
  span:nth-child(4) { left: 39%; top: 12%; animation-delay: .9s; }
  span:nth-child(5) { left: 46%; top: 40%; animation-delay: 1.2s; }
  span:nth-child(6) { left: 56%; top: 19%; animation-delay: 1.5s; }
  span:nth-child(7) { left: 64%; top: 33%; animation-delay: 1.8s; }
  span:nth-child(8) { left: 72%; top: 14%; animation-delay: 2.1s; }
  span:nth-child(9) { left: 84%; top: 28%; animation-delay: 2.4s; }
  span:nth-child(10) { left: 16%; top: 72%; animation-delay: 2.7s; }
  span:nth-child(11) { left: 28%; top: 64%; animation-delay: 3s; }
  span:nth-child(12) { left: 42%; top: 78%; animation-delay: 3.3s; }
  span:nth-child(13) { left: 58%; top: 66%; animation-delay: 3.6s; }
  span:nth-child(14) { left: 70%; top: 76%; animation-delay: 3.9s; }
  span:nth-child(15) { left: 88%; top: 62%; animation-delay: 4.2s; }
  span:nth-child(16) { left: 8%; top: 45%; animation-delay: 4.5s; }
  span:nth-child(17) { left: 51%; top: 8%; animation-delay: 4.8s; }
  span:nth-child(18) { left: 91%; top: 44%; animation-delay: 5.1s; }
}

.content-product {
  position: relative;
  z-index: 2;
  overflow: hidden;
  padding: 92px clamp(16px, 5vw, 80px) 36px;
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
      linear-gradient(180deg, rgba(255, 253, 246, 0.88), rgba(237, 245, 239, 0.82)),
      radial-gradient(760px 220px at 50% 10%, rgba(182, 138, 55, 0.1), transparent 70%),
      linear-gradient(90deg, rgba(31, 141, 122, 0.06) 1px, transparent 1px);
    background-size: auto, auto, 72px 72px;
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  &__eyebrow {
    margin: 0 0 30px;
    color: #946b20;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  &__title {
    margin: 0 0 4px;
    font-size: clamp(30px, 2.5vw, 42px);
    font-weight: 700;
    color: #173f36;
  }

  &__tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 28px;
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 58px;
    padding: 10px 24px;
    border: 1px solid rgba(31, 141, 122, 0.16);
    border-radius: 8px;
    background: rgba(255, 253, 246, 0.64);
    box-shadow: 0 12px 30px rgba(23, 74, 61, 0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #123c32;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms ease;

    &:hover {
      color: #0d7a66;
      border-color: rgba(31, 141, 122, 0.32);
      background: rgba(255, 253, 246, 0.84);
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(23, 74, 61, 0.12);
    }

    &.is-active {
      color: #0d675d;
      background: rgba(31, 141, 122, 0.15);
      border-color: rgba(31, 141, 122, 0.4);
      box-shadow: 
        inset 0 0 0 1px rgba(31, 141, 122, 0.06),
        0 16px 40px rgba(23, 74, 61, 0.12);
      font-weight: 600;
      transform: translateY(-2px);
    }
  }

  &__panel {
    width: min(100%, 1440px);
    min-height: 800px;
    margin: 0 auto;
  }

  &__loading {
    display: grid;
    min-height: 200px;
    place-items: center;
    border: 1px solid rgba(31, 141, 122, 0.12);
    border-radius: 8px;
    background: rgba(255, 253, 246, 0.56);
  }

  &__list {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 1200px) {
      max-width: 920px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 768px) {
      max-width: 460px;
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes meridian-glow {
  0%, 100% {
    opacity: 0.22;
    transform: scale(0.78);
  }

  48% {
    opacity: 0.78;
    transform: scale(1.32);
  }
}

@media (max-width: 768px) {
  .header-title {
    width: calc(100% - 28px);
    padding: 42px 0 22px;

    .title {
      font-size: 28px;
      line-height: 1.25;
    }

    .sub-title {
      font-size: 15px;
    }
  }

  .hero-signals {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .header-section {
    margin-bottom: 34px;
    padding: 0 12px;
  }

  .content-product {
    padding: 52px 16px 24px;

    &__tabs {
      flex-wrap: wrap;
    }

    &__tab {
      flex: 1 1 120px;
      padding: 10px 12px;
      font-size: 16px;
    }

    &__panel {
      min-height: 900px;
    }
  }
}

@media (max-width: 520px) {
  .hero-signals {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .header-section,
  .data-meridian span {
    animation: none;
  }
}
</style>
