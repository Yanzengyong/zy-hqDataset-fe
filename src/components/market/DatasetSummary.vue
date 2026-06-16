<script setup>
import { computed, ref } from 'vue'
import {
  Building2,
  Clock3,
  Database,
  Download,
  HardDrive,
  Heart,
  Layers3,
} from 'lucide-vue-next'
import TagBadge from '../common/TagBadge.vue'
import { simulateDownload } from '../../services/mockApi.js'

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
    label: '提供方',
    value: props.dataset.provider,
    icon: Building2,
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
    <div class="dataset-summary__logo" aria-hidden="true">
      {{ dataset.logoText }}
    </div>

    <div class="dataset-summary__body">
      <div class="dataset-summary__header">
        <div class="dataset-summary__title-group">
          <p class="dataset-summary__eyebrow">{{ dataset.category }} · {{ dataset.taskType }}</p>
          <h1 id="dataset-summary-title">{{ dataset.name }}</h1>
          <p class="dataset-summary__summary">{{ dataset.summary }}</p>
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
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 18px;
  padding: 22px;
  border: 1px solid rgba(39, 92, 160, 0.16);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(39, 92, 160, 0.08), rgba(18, 127, 132, 0.04)),
    var(--color-panel);
  box-shadow: 0 12px 30px rgba(24, 36, 51, 0.05);
}

.dataset-summary__logo {
  display: grid;
  width: 92px;
  height: 92px;
  place-items: center;
  border: 1px solid rgba(39, 92, 160, 0.2);
  border-radius: 8px;
  color: var(--color-blue-deep);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(224, 235, 247, 0.9)),
    #ffffff;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
}

.dataset-summary__body,
.dataset-summary__title-group {
  min-width: 0;
}

.dataset-summary__body {
  display: grid;
  gap: 14px;
}

.dataset-summary__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
}

.dataset-summary__eyebrow {
  margin: 0 0 7px;
  color: var(--color-teal);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.dataset-summary h1 {
  margin: 0;
  color: var(--color-ink);
  font-size: 26px;
  line-height: 1.25;
  letter-spacing: 0;
}

.dataset-summary__summary {
  margin: 8px 0 0;
  color: var(--color-ink-soft);
  font-size: 14px;
  line-height: 1.75;
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
  background: rgba(255, 255, 255, 0.92);
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
  background: var(--color-blue);
  border-color: var(--color-blue);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.dataset-summary__download:hover:not(:disabled) {
  background: var(--color-blue-deep);
  border-color: var(--color-blue-deep);
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px 14px;
  margin: 0;
}

.dataset-summary__metrics div {
  min-width: 0;
  padding-top: 10px;
  border-top: 1px solid rgba(39, 92, 160, 0.13);
}

.dataset-summary__metrics dt {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 4px;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
}

.dataset-summary__metrics dd {
  margin: 0;
  overflow: hidden;
  color: var(--color-ink-soft);
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

  .dataset-summary__logo {
    width: 70px;
    height: 70px;
    font-size: 16px;
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
