<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Clock3,
  Database,
  Download,
  HardDrive,
  Heart,
} from 'lucide-vue-next'
import TagBadge from '../common/TagBadge.vue'
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

const router = useRouter()

const detailTo = computed(() => ({
  name: 'dataset-detail',
  params: {
    id: props.dataset.id,
  },
}))

const formattedDownloads = computed(() =>
  Number(props.dataset.downloads ?? 0).toLocaleString('zh-CN'),
)

const formattedSize = computed(() => `${Number(props.dataset.size ?? 0).toFixed(1)} GB`)

const datasetCover = computed(() => getDatasetCover(props.dataset))

const openDetail = () => {
  router.push(detailTo.value)
}
</script>

<template>
  <article
    class="dataset-card"
    @click="openDetail"
  >
    <figure class="dataset-card__cover">
      <img :src="datasetCover" :alt="`${dataset.name}商品图`" />
      <figcaption>{{ dataset.logoText }}</figcaption>
    </figure>

    <div class="dataset-card__body">
      <div class="dataset-card__header">
        <div class="dataset-card__title-group">
          <RouterLink class="dataset-card__title" :to="detailTo" @click.stop>
            {{ dataset.name }}
          </RouterLink>
          <p>{{ dataset.summary }}</p>
        </div>
      </div>

      <RouterLink class="dataset-card__summary-link" :to="detailTo" @click.stop>
        <span class="dataset-card__category">
          <Database :size="15" aria-hidden="true" />
          {{ dataset.category }} · {{ dataset.taskType }}
        </span>
      </RouterLink>

      <div class="dataset-card__tags" aria-label="数据集标签">
        <TagBadge
          v-for="tag in dataset.tags"
          :key="`${dataset.id}-${tag}`"
          tone="blue"
        >
          {{ tag }}
        </TagBadge>
      </div>

      <div class="dataset-card__provider">
        <span>提供方</span>
        <strong>{{ dataset.provider }}</strong>
      </div>
    </div>

    <aside class="dataset-card__shelf">
      <button
        class="dataset-card__favorite"
        :class="{ 'is-active': dataset.isFavorite }"
        type="button"
        :aria-pressed="dataset.isFavorite"
        :aria-label="dataset.isFavorite ? '取消收藏' : '收藏数据集'"
        @click.stop="$emit('toggle-favorite', dataset.id)"
        @keydown.enter.stop
        @keydown.space.stop
      >
        <Heart :size="17" :fill="dataset.isFavorite ? 'currentColor' : 'none'" aria-hidden="true" />
      </button>

      <dl class="dataset-card__meta">
        <div>
          <dt><Download :size="14" aria-hidden="true" />下载</dt>
          <dd>{{ formattedDownloads }}</dd>
        </div>
        <div>
          <dt><HardDrive :size="14" aria-hidden="true" />规模</dt>
          <dd>{{ formattedSize }}</dd>
        </div>
        <div>
          <dt><Clock3 :size="14" aria-hidden="true" />更新</dt>
          <dd>{{ dataset.updatedAt }}</dd>
        </div>
      </dl>
    </aside>
  </article>
</template>

<style scoped>
.dataset-card {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: 164px minmax(0, 1fr) 240px;
  gap: 18px;
  min-height: 170px;
  padding: 16px 16px 16px 20px;
  overflow: hidden;
  border: 1px solid rgba(31, 141, 122, 0.2);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(31, 141, 122, 0.13), rgba(255, 253, 246, 0.88) 42%, rgba(247, 251, 239, 0.95)),
    rgba(255, 253, 246, 0.94);
  box-shadow:
    0 10px 26px rgba(23, 74, 61, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.dataset-card::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(115deg, transparent 0 38%, rgba(255, 255, 255, 0.3) 38% 50%, transparent 50% 100%),
    linear-gradient(90deg, rgba(182, 138, 55, 0.12) 0 1px, transparent 1px 100%);
  background-size: auto, 34px 34px;
  opacity: 0.5;
  content: "";
}

.dataset-card::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  background: linear-gradient(180deg, #2aa28a, #c49a47);
  content: "";
}

.dataset-card:hover {
  border-color: rgba(31, 141, 122, 0.38);
  box-shadow: 0 16px 32px rgba(23, 74, 61, 0.1);
  transform: translateY(-1px);
}

.dataset-card__cover {
  position: relative;
  align-self: stretch;
  min-height: 136px;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background: #eef7ef;
  box-shadow:
    inset 0 -18px 28px rgba(31, 141, 122, 0.1),
    0 8px 20px rgba(23, 74, 61, 0.06);
}

.dataset-card__cover img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 136px;
  object-fit: cover;
}

.dataset-card__cover::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(13, 103, 93, 0.1)),
    linear-gradient(120deg, rgba(255, 255, 255, 0.22), transparent 42%);
  content: "";
  pointer-events: none;
}

.dataset-card__cover::after {
  position: absolute;
  inset: auto 0 0;
  height: 38%;
  background: linear-gradient(180deg, transparent, rgba(6, 47, 43, 0.42));
  content: "";
  pointer-events: none;
}

.dataset-card__cover figcaption {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 1;
  max-width: calc(100% - 20px);
  padding: 4px 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 6px;
  color: #ffffff;
  background: rgba(13, 103, 93, 0.68);
  backdrop-filter: blur(6px);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dataset-card__body {
  display: grid;
  min-width: 0;
  align-content: center;
  gap: 12px;
}

.dataset-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.dataset-card__title-group {
  min-width: 0;
}

.dataset-card__title {
  display: inline;
  color: var(--color-ink);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0;
}

.dataset-card__title:hover {
  color: #1f8d7a;
}

.dataset-card__title-group p {
  display: -webkit-box;
  margin: 6px 0 0;
  overflow: hidden;
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.dataset-card__favorite {
  display: inline-grid;
  justify-self: end;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 6px;
  color: var(--color-muted);
  background: rgba(255, 253, 246, 0.9);
}

.dataset-card__favorite:hover,
.dataset-card__favorite.is-active {
  border-color: rgba(190, 62, 62, 0.22);
  color: var(--color-danger);
  background: rgba(190, 62, 62, 0.08);
}

.dataset-card__summary-link {
  justify-self: start;
  min-width: 0;
}

.dataset-card__category {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 6px;
  color: #1b7d6d;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.dataset-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.dataset-card__provider {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 6px;
  color: #6f8078;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
}

.dataset-card__provider strong {
  min-width: 0;
  overflow: hidden;
  color: #30433c;
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dataset-card__shelf {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 14px;
  min-width: 0;
  padding-left: 18px;
  border-left: 1px solid rgba(31, 141, 122, 0.14);
}

.dataset-card__meta {
  display: grid;
  align-content: end;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.dataset-card__meta div {
  display: grid;
  align-content: center;
  min-width: 0;
  min-height: 58px;
  padding: 9px 10px;
  border: 1px solid rgba(31, 141, 122, 0.14);
  border-radius: 8px;
  background: rgba(255, 253, 246, 0.72);
}

.dataset-card__meta dt {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 3px;
  color: #6f8078;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
}

.dataset-card__meta dd {
  margin: 0;
  overflow: hidden;
  color: #30433c;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1120px) {
  .dataset-card {
    grid-template-columns: 148px minmax(0, 1fr);
  }

  .dataset-card__shelf {
    grid-column: 1 / -1;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding-top: 12px;
    padding-left: 0;
    border-top: 1px solid rgba(31, 141, 122, 0.14);
    border-left: 0;
  }

  .dataset-card__favorite {
    justify-self: start;
  }
}

@media (max-width: 760px) {
  .dataset-card__meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .dataset-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 14px;
  }

  .dataset-card__cover {
    min-height: 148px;
  }

  .dataset-card__shelf,
  .dataset-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
