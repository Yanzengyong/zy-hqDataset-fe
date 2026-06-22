<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getDatasetCover } from '../../utils/datasetCovers.js'

const props = defineProps({
  dataset: {
    type: Object,
    required: true
  },
  imageSrc: {
    type: String,
    default: ''
  }
})

const router = useRouter()

const detailTo = computed(() => ({
  name: 'dataset-detail',
  params: {
    id: props.dataset.id,
  },
}))

const openDetail = () => {
  router.push(detailTo.value)
}

const imageLoadFailed = ref(false)

const cardImageSrc = computed(() => props.imageSrc || props.dataset.imageSrc || '')

watch(cardImageSrc, () => {
  imageLoadFailed.value = false
})

const formattedDate = computed(() => {
  if (!props.dataset.updatedAt) return ''
  const date = new Date(props.dataset.updatedAt)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})

const formattedSize = computed(() => {
  if (!props.dataset.size) return '未知'
  const size = props.dataset.size
  if (size >= 1024) return `${(size / 1024).toFixed(1)} TB`
  if (size >= 1) return `${size.toFixed(1)} GB`
  return `${(size * 1024).toFixed(0)} MB`
})

const formattedDownloads = computed(() => {
  if (!props.dataset.downloads) return '0'
  const downloads = props.dataset.downloads
  if (downloads >= 10000) return `${(downloads / 10000).toFixed(1)}万`
  if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}k`
  return downloads.toString()
})

const datasetCover = computed(() => getDatasetCover(props.dataset))
const resolvedImageSrc = computed(() =>
  !imageLoadFailed.value && cardImageSrc.value ? cardImageSrc.value : datasetCover.value,
)
</script>

<template>
  <div class="dataset-grid-card" @click="openDetail">
    <figure class="dataset-grid-card__cover">
      <img
        :src="resolvedImageSrc"
        :alt="`${dataset.name}商品图`"
        @error="imageLoadFailed = true"
      />
      <figcaption>{{ dataset.logoText || dataset.name?.charAt(0) }}</figcaption>
    </figure>

    <div class="dataset-grid-card__header">
      <div class="dataset-grid-card__info">
        <h3 class="dataset-grid-card__name">{{ dataset.name }}</h3>
      </div>
    </div>

    <div class="dataset-grid-card__body">
      <p class="dataset-grid-card__summary">{{ dataset.summary }}</p>

      <div class="dataset-grid-card__tags">
        <span
          v-for="tag in dataset.tags?.slice(0, 3)"
          :key="tag"
          class="dataset-grid-card__tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="dataset-grid-card__footer">
      <div class="dataset-grid-card__meta">
        <span class="dataset-grid-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {{ formattedDownloads }}
        </span>
        <span class="dataset-grid-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
            <line x1="10" y1="2" x2="10" y2="22"></line>
          </svg>
          {{ formattedSize }}
        </span>
      </div>
      <span class="dataset-grid-card__date">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dataset-grid-card {
  background:
    linear-gradient(135deg, rgba(31, 141, 122, 0.1), rgba(255, 253, 246, 0.92) 48%, rgba(247, 251, 239, 0.96)),
    #fffdf6;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  padding: 14px 16px 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(23, 74, 61, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(23, 74, 61, 0.1);
    border-color: rgba(31, 141, 122, 0.36);
  }

  &__cover {
    position: relative;
    aspect-ratio: 1 / 0.68;
    margin: 0 0 14px;
    overflow: hidden;
    border: 1px solid rgba(31, 141, 122, 0.18);
    border-radius: 8px;
    background: #eef7ef;
    box-shadow: inset 0 -18px 28px rgba(31, 141, 122, 0.1);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }

    &::after {
      position: absolute;
      inset: auto 0 0;
      height: 44%;
      background: linear-gradient(180deg, transparent, rgba(6, 47, 43, 0.48));
      content: '';
      pointer-events: none;
    }

    figcaption {
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
      background: rgba(13, 103, 93, 0.72);
      backdrop-filter: blur(6px);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &:hover &__cover img {
    transform: scale(1.035);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: #173f36;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__provider {
    margin: 0;
    font-size: 13px;
    color: #66766f;
  }

  &__body {
    padding: 0 20px;
    margin-bottom: 16px;
    min-width: 0;
  }

  &__summary {
    display: block;
    max-width: 100%;
    margin: 0 0 12px;
    font-size: 14px;
    color: #30433c;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__tag {
    padding: 4px 10px;
    border: 1px solid rgba(31, 141, 122, 0.16);
    background: rgba(31, 141, 122, 0.08);
    border-radius: 6px;
    font-size: 12px;
    color: #0d675d;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid rgba(31, 141, 122, 0.14);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #66766f;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__date {
    font-size: 12px;
    color: #66766f;
  }
}
</style>
