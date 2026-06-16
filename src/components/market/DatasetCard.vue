<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Building2,
  Clock3,
  Database,
  Download,
  HardDrive,
  Heart,
} from 'lucide-vue-next'
import TagBadge from '../common/TagBadge.vue'

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

const openDetail = () => {
  router.push(detailTo.value)
}
</script>

<template>
  <article
    class="dataset-card"
    tabindex="0"
    role="link"
    :aria-label="`查看${dataset.name}`"
    @click="openDetail"
    @keydown.enter.prevent="openDetail"
  >
    <div class="dataset-card__logo" aria-hidden="true">
      {{ dataset.logoText }}
    </div>

    <div class="dataset-card__body">
      <div class="dataset-card__header">
        <div class="dataset-card__title-group">
          <RouterLink class="dataset-card__title" :to="detailTo" @click.stop>
            {{ dataset.name }}
          </RouterLink>
          <p>{{ dataset.summary }}</p>
        </div>

        <button
          class="dataset-card__favorite"
          :class="{ 'is-active': dataset.isFavorite }"
          type="button"
          :aria-pressed="dataset.isFavorite"
          :aria-label="dataset.isFavorite ? '取消收藏' : '收藏数据集'"
          @click.stop="$emit('toggle-favorite', dataset.id)"
        >
          <Heart :size="17" :fill="dataset.isFavorite ? 'currentColor' : 'none'" aria-hidden="true" />
        </button>
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

      <dl class="dataset-card__meta">
        <div>
          <dt><Building2 :size="14" aria-hidden="true" />提供方</dt>
          <dd>{{ dataset.provider }}</dd>
        </div>
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
    </div>
  </article>
</template>

<style scoped>
.dataset-card {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 16px;
  padding: 18px;
  border: 1px solid rgba(39, 92, 160, 0.14);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(39, 92, 160, 0.08), rgba(18, 127, 132, 0.04)),
    #f8fbff;
  box-shadow: 0 8px 22px rgba(24, 36, 51, 0.04);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.dataset-card:hover {
  border-color: rgba(39, 92, 160, 0.3);
  box-shadow: 0 14px 28px rgba(24, 36, 51, 0.08);
  transform: translateY(-1px);
}

.dataset-card__logo {
  display: grid;
  width: 68px;
  height: 68px;
  place-items: center;
  border: 1px solid rgba(39, 92, 160, 0.18);
  border-radius: 8px;
  color: var(--color-blue-deep);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(224, 235, 247, 0.86)),
    #ffffff;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
}

.dataset-card__body {
  display: grid;
  min-width: 0;
  gap: 11px;
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
  color: var(--color-blue-deep);
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
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-muted);
  background: rgba(255, 255, 255, 0.9);
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
  color: var(--color-blue-deep);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.dataset-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.dataset-card__meta {
  display: grid;
  grid-template-columns: minmax(160px, 1.3fr) repeat(3, minmax(82px, auto));
  gap: 10px 16px;
  margin: 0;
  padding-top: 2px;
}

.dataset-card__meta div {
  min-width: 0;
}

.dataset-card__meta dt {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 3px;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
}

.dataset-card__meta dd {
  margin: 0;
  overflow: hidden;
  color: var(--color-ink-soft);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .dataset-card__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .dataset-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 14px;
  }

  .dataset-card__logo {
    width: 56px;
    height: 56px;
    font-size: 14px;
  }

  .dataset-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
