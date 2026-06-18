<script setup>
import { computed, ref, watch } from 'vue'

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

const emit = defineEmits(['toggle-favorite'])
const imageLoadFailed = ref(false)

const cardImageSrc = computed(() => props.imageSrc || props.dataset.imageSrc || '')

watch(cardImageSrc, () => {
  imageLoadFailed.value = false
})

const handleToggleFavorite = () => {
  emit('toggle-favorite', props.dataset.id)
}

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
</script>

<template>
  <div class="dataset-grid-card">
    <div
      class="dataset-grid-card__cover"
      :class="{ 'is-empty': !cardImageSrc || imageLoadFailed }"
      :style="cardImageSrc && !imageLoadFailed ? { backgroundImage: `url(${cardImageSrc})` } : null"
      role="img"
      :aria-label="dataset.name"
    >
      <img
        v-if="cardImageSrc && !imageLoadFailed"
        :src="cardImageSrc"
        :alt="dataset.name"
        loading="lazy"
        @error="imageLoadFailed = true"
      />
    </div>
    <div class="dataset-grid-card__header">
      <div class="dataset-grid-card__info">
        <h3 class="dataset-grid-card__name">{{ dataset.name }}</h3>
      </div>
      <button
        class="dataset-grid-card__favorite"
        :class="{ 'is-active': dataset.isFavorite }"
        type="button"
        :aria-pressed="dataset.isFavorite"
        :aria-label="dataset.isFavorite ? '取消收藏' : '收藏数据集'"
        @click.stop="handleToggleFavorite"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  &__cover {
    width: 100%;
    aspect-ratio: 16 / 9;
    min-height: 160px;
    background-color: #eef3f6;
    background-position: center;
    background-size: cover;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(17, 24, 39, 0.02), rgba(17, 24, 39, 0.18));
      pointer-events: none;
    }

    &.is-empty {
      background:
        linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(16, 185, 129, 0.12)),
        #eef3f6;
    }

    img {
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
      position: absolute;
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 20px 0;
    margin-bottom: 16px;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__favorite {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    transition: all 0.2s ease;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      color: #ef4444;
      transform: scale(1.1);
    }

    &.is-active {
      color: #ef4444;

      svg {
        fill: #ef4444;
      }
    }
  }

  &__body {
    padding: 0 20px;
    margin-bottom: 16px;
  }

  &__summary {
    margin: 0 0 12px;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__tag {
    padding: 4px 10px;
    background: #f3f4f6;
    border-radius: 6px;
    font-size: 12px;
    color: #6b7280;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 18px;
    border-top: 1px solid #f3f4f6;
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
    color: #9ca3af;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__date {
    font-size: 12px;
    color: #9ca3af;
  }
}
</style>
