<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Download, FileText } from 'lucide-vue-next'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import Breadcrumb from '../components/layout/Breadcrumb.vue'
import DatasetSummary from '../components/market/DatasetSummary.vue'
import DatasetTabs from '../components/market/DatasetTabs.vue'
import ProviderPanel from '../components/market/ProviderPanel.vue'
import RelatedDatasets from '../components/market/RelatedDatasets.vue'
import marketHeroImage from '../assets/market/tcm-market-hero.png'
import {
  getDatasetDetail,
  getRelatedDatasets,
  simulateDownload,
  toggleFavorite,
} from '../services/mockApi.js'

const route = useRoute()

const dataset = ref(null)
const relatedDatasets = ref([])
const loading = ref(true)
const documentDownloading = ref(false)
const documentDownloadLabel = ref('下载规范文档')
let requestId = 0
let documentDownloadRequestId = 0
let documentDownloadTimer = 0

const breadcrumbItems = computed(() => [
  {
    label: '首页',
    to: '/',
  },
  {
    label: '数据集专区',
    to: '/market',
  },
  {
    label: dataset.value?.name ?? '数据集详情',
  },
])

const currentDatasetId = computed(() => String(route.params.id ?? ''))

const resetDocumentDownloadState = () => {
  documentDownloadRequestId += 1
  globalThis.clearTimeout(documentDownloadTimer)
  documentDownloadTimer = 0
  documentDownloading.value = false
  documentDownloadLabel.value = '下载规范文档'
}

const loadDatasetDetail = async () => {
  const currentRequestId = requestId + 1
  requestId = currentRequestId
  loading.value = true
  dataset.value = null
  relatedDatasets.value = []
  resetDocumentDownloadState()

  const [detail, related] = await Promise.all([
    getDatasetDetail(currentDatasetId.value),
    getRelatedDatasets(currentDatasetId.value),
  ])

  if (currentRequestId !== requestId) {
    return
  }

  dataset.value = detail
  relatedDatasets.value = related
  loading.value = false
}

const toggleDatasetFavorite = async (id) => {
  const updatedDataset = await toggleFavorite(id)

  if (!updatedDataset || dataset.value?.id !== id) {
    return
  }

  dataset.value = updatedDataset
}

const downloadDocument = async () => {
  if (documentDownloading.value || !dataset.value) {
    return
  }

  documentDownloading.value = true
  documentDownloadLabel.value = '正在创建任务'

  const datasetId = dataset.value.id
  const currentDocumentDownloadRequestId = documentDownloadRequestId + 1
  documentDownloadRequestId = currentDocumentDownloadRequestId

  const result = await simulateDownload(datasetId)

  if (
    currentDocumentDownloadRequestId !== documentDownloadRequestId ||
    dataset.value?.id !== datasetId ||
    result.id !== datasetId
  ) {
    return
  }

  documentDownloadLabel.value = result.status === 'success' ? '文档下载已创建' : '下载失败'
  documentDownloading.value = false

  globalThis.clearTimeout(documentDownloadTimer)
  documentDownloadTimer = globalThis.setTimeout(() => {
    if (
      currentDocumentDownloadRequestId !== documentDownloadRequestId ||
      dataset.value?.id !== datasetId
    ) {
      return
    }

    documentDownloadLabel.value = '下载规范文档'
    documentDownloadTimer = 0
  }, 1600)
}

onMounted(() => {
  loadDatasetDetail()
})

watch(currentDatasetId, () => {
  loadDatasetDetail()
})

onUnmounted(() => {
  resetDocumentDownloadState()
})
</script>

<template>
  <section
    class="dataset-detail"
    :style="{ '--detail-bg-image': `url(${marketHeroImage})` }"
  >
    <header class="dataset-detail__header">
      <Breadcrumb :items="breadcrumbItems" />
    </header>

    <div v-if="loading" class="dataset-detail__loading">
      <LoadingState text="正在载入数据集详情..." />
    </div>

    <EmptyState
      v-else-if="!dataset"
      title="未找到数据集"
      description="该数据集不存在或已下架，请返回数据集专区查看其他资源。"
    />

    <template v-else>
      <DatasetSummary
        :dataset="dataset"
        @toggle-favorite="toggleDatasetFavorite"
      />

      <div class="dataset-detail__layout">
        <main class="dataset-detail__main" aria-label="数据集详情主体">
          <DatasetTabs :dataset="dataset" />

          <section class="dataset-detail__document" aria-labelledby="dataset-document-title">
            <div class="dataset-detail__document-header">
              <div>
                <p class="dataset-detail__document-eyebrow">数据规范预览</p>
                <h2 id="dataset-document-title">数据说明文档</h2>
              </div>
              <button
                class="dataset-detail__document-button"
                type="button"
                :disabled="documentDownloading"
                @click="downloadDocument"
              >
                <Download :size="16" aria-hidden="true" />
                <span>{{ documentDownloadLabel }}</span>
              </button>
            </div>

            <div class="dataset-detail__document-preview">
              <FileText :size="22" aria-hidden="true" />
              <p>{{ dataset.document }}</p>
            </div>
          </section>
        </main>

        <aside class="dataset-detail__sidebar" aria-label="数据集侧栏">
          <ProviderPanel :dataset="dataset" />
          <RelatedDatasets :datasets="relatedDatasets" />
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped>
.dataset-detail {
  --color-blue: #218a79;
  --color-blue-deep: #0d675d;
  --color-teal: #1f8d7a;
  --color-green: #4b7d3a;
  --color-gold: #b68a37;
  --color-border: #d5e3d8;
  --color-border-strong: #afcbb8;
  --color-panel: #fffdf6;
  --color-panel-subtle: #f3f8ee;
  --color-muted: #66766f;
  display: grid;
  grid-auto-rows: max-content;
  align-content: start;
  gap: 16px;
  min-height: calc(100vh - 80px);
  height: calc(100vh - 80px);
  padding: 16px 24px 24px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(31, 141, 122, 0.32) transparent;
  background:
    linear-gradient(180deg, rgba(237, 245, 239, 0.92), rgba(237, 245, 239, 0.78)),
    linear-gradient(90deg, rgba(237, 245, 239, 0.92) 0%, rgba(237, 245, 239, 0.76) 48%, rgba(237, 245, 239, 0.58) 100%),
    var(--detail-bg-image) center / cover no-repeat,
    #edf5ef;
}

.dataset-detail::-webkit-scrollbar {
  width: 6px;
}

.dataset-detail::-webkit-scrollbar-track {
  background: transparent;
}

.dataset-detail::-webkit-scrollbar-thumb {
  background-color: rgba(31, 141, 122, 0.32);
  border-radius: 3px;
}

.dataset-detail::-webkit-scrollbar-thumb:hover {
  background-color: rgba(31, 141, 122, 0.55);
}

.dataset-detail::-webkit-scrollbar-thumb:active {
  background-color: rgba(31, 141, 122, 0.75);
}

.dataset-detail__header {
  display: grid;
  gap: 12px;
}

.dataset-detail__loading {
  display: grid;
  min-height: 320px;
  place-items: center;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 253, 246, 0.96), rgba(244, 250, 240, 0.94)),
    var(--color-panel);
  box-shadow: 0 14px 34px rgba(23, 74, 61, 0.07);
}

.dataset-detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
  align-items: start;
}

.dataset-detail__main,
.dataset-detail__sidebar {
  display: grid;
  min-width: 0;
  gap: 16px;
}

.dataset-detail__sidebar {
  position: sticky;
  top: 84px;
}

.dataset-detail__document {
  padding: 20px;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 253, 246, 0.97), rgba(247, 251, 241, 0.94)),
    var(--color-panel);
  box-shadow: 0 14px 34px rgba(23, 74, 61, 0.07);
}

.dataset-detail__document-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
  margin-bottom: 14px;
}

.dataset-detail__document-eyebrow {
  margin: 0 0 5px;
  color: #1f8d7a;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.dataset-detail__document h2 {
  margin: 0;
  color: #173f36;
  font-size: 17px;
  line-height: 1.4;
  letter-spacing: 0;
}

.dataset-detail__document-button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid rgba(31, 141, 122, 0.2);
  border-radius: 6px;
  color: #0d675d;
  background: rgba(31, 141, 122, 0.09);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.dataset-detail__document-button:hover:not(:disabled) {
  border-color: rgba(31, 141, 122, 0.3);
  background: rgba(31, 141, 122, 0.14);
}

.dataset-detail__document-button:disabled {
  opacity: 0.72;
}

.dataset-detail__document-preview {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 16px;
  border: 1px dashed rgba(31, 141, 122, 0.28);
  border-radius: 8px;
  color: #0d675d;
  background:
    linear-gradient(135deg, rgba(31, 141, 122, 0.08), rgba(182, 138, 55, 0.05)),
    rgba(255, 253, 246, 0.78);
}

.dataset-detail__document-preview p {
  margin: 0;
  color: #30433c;
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .dataset-detail__layout {
    grid-template-columns: 1fr;
  }

  .dataset-detail__sidebar {
    position: static;
  }
}

@media (max-width: 560px) {
  .dataset-detail {
    min-height: calc(100vh - 96px);
  }

  .dataset-detail__document {
    padding: 16px;
  }

  .dataset-detail__document-header,
  .dataset-detail__document-preview {
    grid-template-columns: 1fr;
  }

  .dataset-detail__document-button {
    justify-self: start;
  }
}
</style>
