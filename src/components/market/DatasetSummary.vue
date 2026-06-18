<script setup>
import { computed, ref } from 'vue'
import {
  Clock3,
  Database,
  Download,
  HardDrive,
  Heart,
  Layers3,
} from 'lucide-vue-next'
import TagBadge from '../common/TagBadge.vue'
import { simulateDownload } from '../../services/mockApi.js'
import { getDatasetCover } from '../../utils/datasetCovers.js'

const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits({
  'toggle-favorite': (id) => typeof id === 'string',
})

const downloading = ref(false)
const downloadLabel = ref('下载数据集')
let downloadTimer = 0

const formattedDownloads = computed(() =>
  Number(props.dataset.downloads ?? 0).toLocaleString('zh-CN'),
)

const formattedSize = computed(() => `${Number(props.dataset.size ?? 0).toFixed(1)} GB`)

const metrics = computed(() => [
  {
    label: '分类',
    value: props.dataset.category,
    icon: Database,
  },
  {
    label: '模态',
    value: props.dataset.modality,
    icon: Layers3,
  },
  {
    label: '下载',
    value: formattedDownloads.value,
    icon: Download,
  },
  {
    label: '规模',
    value: formattedSize.value,
    icon: HardDrive,
  },
  {
    label: '更新',
    value: props.dataset.updatedAt,
    icon: Clock3,
  },
])

const datasetCover = computed(() => getDatasetCover(props.dataset))

const downloadDataset = async () => {
  if (downloading.value) {
    return
  }

  downloading.value = true
  downloadLabel.value = '正在创建任务'

  const result = await simulateDownload(props.dataset.id)
  downloadLabel.value = result.status === 'success' ? '下载任务已创建' : '下载失败'
  downloading.value = false

  globalThis.clearTimeout(downloadTimer)
  downloadTimer = globalThis.setTimeout(() => {
    downloadLabel.value = '下载数据集'
  }, 1600)
}
</script>

<template>
  <section class="dataset-summary" aria-labelledby="dataset-summary-title">
    <figure class="dataset-summary__cover">
      <img :src="datasetCover" :alt="`${dataset.name}商品图`" />
      <figcaption>{{ dataset.logoText }}</figcaption>
    </figure>

    <div class="dataset-summary__body">
      <div class="dataset-summary__header">
        <div class="dataset-summary__title-group">
          <p class="dataset-summary__eyebrow">数据商品 · {{ dataset.category }} · {{ dataset.taskType }}</p>
          <h1 id="dataset-summary-title">{{ dataset.name }}</h1>
          <p class="dataset-summary__summary">{{ dataset.summary }}</p>
          <p class="dataset-summary__provider">提供方：{{ dataset.provider }}</p>
        </div>

        <div class="dataset-summary__actions">
          <button
            class="dataset-summary__icon-button"
            :class="{ 'is-active': dataset.isFavorite }"
            type="button"
            :aria-pressed="dataset.isFavorite"
            :aria-label="dataset.isFavorite ? '取消收藏' : '收藏数据集'"
            @click="$emit('toggle-favorite', dataset.id)"
          >
            <Heart :size="18" :fill="dataset.isFavorite ? 'currentColor' : 'none'" aria-hidden="true" />
          </button>

          <button
            class="dataset-summary__download"
            type="button"
            :disabled="downloading"
            @click="downloadDataset"
          >
            <Download :size="17" aria-hidden="true" />
            <span>{{ downloadLabel }}</span>
          </button>
        </div>
      </div>

      <div class="dataset-summary__tags" aria-label="数据集标签">
        <TagBadge
          v-for="tag in dataset.tags"
          :key="`${dataset.id}-${tag}`"
          tone="blue"
        >
          {{ tag }}
        </TagBadge>
      </div>

      <dl class="dataset-summary__metrics">
        <div v-for="metric in metrics" :key="metric.label">
          <dt>
            <component :is="metric.icon" :size="14" aria-hidden="true" />
            {{ metric.label }}
          </dt>
          <dd>{{ metric.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.dataset-summary {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(230px, 28%) minmax(0, 1fr);
  gap: 22px;
  padding: 20px;
  overflow: hidden;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(31, 141, 122, 0.13), rgba(255, 253, 246, 0.9) 44%, rgba(247, 251, 239, 0.96)),
    var(--color-panel, #fffdf6);
  box-shadow:
    0 16px 36px rgba(23, 74, 61, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.dataset-summary::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(115deg, transparent 0 42%, rgba(255, 255, 255, 0.28) 42% 53%, transparent 53% 100%),
    linear-gradient(90deg, rgba(182, 138, 55, 0.08) 0 1px, transparent 1px 100%);
  background-size: auto, 34px 34px;
  content: "";
  opacity: 0.45;
}

.dataset-summary__cover {
  position: relative;
  min-height: 224px;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background: #eef7ef;
  box-shadow: 0 10px 24px rgba(23, 74, 61, 0.08);
}

.dataset-summary__cover img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 224px;
  object-fit: cover;
}

.dataset-summary__cover::after {
  position: absolute;
  inset: auto 0 0;
  height: 40%;
  background: linear-gradient(180deg, transparent, rgba(6, 47, 43, 0.5));
  content: "";
}

.dataset-summary__cover figcaption {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 1;
  max-width: calc(100% - 28px);
  padding: 5px 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 6px;
  color: #ffffff;
  background: rgba(13, 103, 93, 0.7);
  backdrop-filter: blur(6px);
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dataset-summary__body,
.dataset-summary__title-group {
  min-width: 0;
}

.dataset-summary__body {
  display: grid;
  align-content: center;
  gap: 16px;
}

.dataset-summary__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
}

.dataset-summary__eyebrow {
  margin: 0 0 7px;
  color: #1f8d7a;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.dataset-summary h1 {
  margin: 0;
  color: #173f36;
  font-size: 30px;
  line-height: 1.25;
  letter-spacing: 0;
}

.dataset-summary__summary {
  margin: 8px 0 0;
  color: #30433c;
  font-size: 14px;
  line-height: 1.75;
}

.dataset-summary__provider {
  margin: 8px 0 0;
  color: #60746a;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

.dataset-summary__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.dataset-summary__icon-button,
.dataset-summary__download {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: rgba(255, 253, 246, 0.94);
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;
}

.dataset-summary__icon-button {
  width: 38px;
  color: var(--color-muted);
}

.dataset-summary__icon-button:hover,
.dataset-summary__icon-button.is-active {
  border-color: rgba(190, 62, 62, 0.22);
  color: var(--color-danger);
  background: rgba(190, 62, 62, 0.08);
}

.dataset-summary__download {
  min-width: 0;
  gap: 7px;
  padding: 0 13px;
  color: #ffffff;
  background: linear-gradient(135deg, #1f8d7a, #0d675d);
  border-color: rgba(31, 141, 122, 0.3);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.dataset-summary__download:hover:not(:disabled) {
  background: linear-gradient(135deg, #239a84, #0b5d53);
  border-color: rgba(31, 141, 122, 0.4);
}

.dataset-summary__download:disabled {
  opacity: 0.72;
}

.dataset-summary__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.dataset-summary__metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px 14px;
  margin: 0;
}

.dataset-summary__metrics div {
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(31, 141, 122, 0.14);
  border-radius: 8px;
  background: rgba(255, 253, 246, 0.72);
}

.dataset-summary__metrics dt {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 4px;
  color: #6f8078;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
}

.dataset-summary__metrics dd {
  margin: 0;
  overflow: hidden;
  color: #30433c;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .dataset-summary {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .dataset-summary__cover,
  .dataset-summary__cover img {
    min-height: 190px;
  }

  .dataset-summary__header {
    grid-template-columns: 1fr;
  }

  .dataset-summary__actions {
    justify-content: flex-start;
  }

  .dataset-summary__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .dataset-summary h1 {
    font-size: 22px;
  }

  .dataset-summary__download {
    white-space: normal;
  }

  .dataset-summary__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
