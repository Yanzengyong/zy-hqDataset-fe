<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { Plus, Search, SlidersHorizontal } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  sort: {
    type: String,
    default: 'latest',
  },
})

const emit = defineEmits({
  'update:modelValue': (value) => typeof value === 'string',
  'update:sort': (value) => ['latest', 'downloads', 'size'].includes(value),
  search: () => true,
})

const publishMessage = ref('')
let publishTimer = null

const keyword = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const showPublishHint = () => {
  publishMessage.value = '演示环境暂未开放发布流程'

  if (publishTimer) {
    window.clearTimeout(publishTimer)
  }

  publishTimer = window.setTimeout(() => {
    publishMessage.value = ''
    publishTimer = null
  }, 2200)
}

onBeforeUnmount(() => {
  if (publishTimer) {
    window.clearTimeout(publishTimer)
  }
})
</script>

<template>
  <section class="dataset-search" aria-label="数据集检索">
    <div class="dataset-search__tabs" role="tablist" aria-label="数据集列表切换">
      <button class="is-active" type="button" role="tab" aria-selected="true">
        数据集列表
      </button>
      <button type="button" role="tab" aria-selected="false">
        数据集建设意向列表
      </button>
    </div>

    <form class="dataset-search__row" @submit.prevent="$emit('search')">
      <label class="dataset-search__input">
        <Search :size="17" aria-hidden="true" />
        <span class="sr-only">关键词</span>
        <input
          v-model="keyword"
          type="search"
          placeholder="请输入数据集名称、标签或应用方向"
          autocomplete="off"
        />
      </label>

      <button class="dataset-search__button dataset-search__button--primary" type="submit">
        搜索
      </button>

      <button class="dataset-search__advanced" type="button">
        <SlidersHorizontal :size="16" aria-hidden="true" />
        高级检索
      </button>

      <label class="dataset-search__sort">
        <span>排序</span>
        <select
          :value="sort"
          @change="$emit('update:sort', $event.target.value)"
        >
          <option value="latest">最新更新</option>
          <option value="downloads">下载最多</option>
          <option value="size">数据规模</option>
        </select>
      </label>

      <button
        class="dataset-search__button dataset-search__button--publish"
        type="button"
        @click="showPublishHint"
      >
        <Plus :size="16" aria-hidden="true" />
        发布数据集
      </button>
    </form>

    <p v-if="publishMessage" class="dataset-search__hint" role="status">
      {{ publishMessage }}
    </p>
  </section>
</template>

<style scoped>
.dataset-search {
  display: grid;
  gap: 14px;
}

.dataset-search__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-bottom: 1px solid var(--color-border);
}

.dataset-search__tabs button {
  min-width: 0;
  min-height: 38px;
  padding: 8px 13px;
  border-bottom: 2px solid transparent;
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.dataset-search__tabs button.is-active {
  border-bottom-color: var(--color-blue);
  color: var(--color-blue-deep);
}

.dataset-search__row {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) auto auto minmax(136px, auto) auto;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.dataset-search__input {
  display: flex;
  min-width: 0;
  min-height: 40px;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-muted);
  background: #ffffff;
}

.dataset-search__input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--color-ink);
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
}

.dataset-search__input input::placeholder {
  color: #8b98a6;
}

.dataset-search__button,
.dataset-search__advanced,
.dataset-search__sort {
  display: inline-flex;
  min-width: 0;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
}

.dataset-search__button {
  padding: 0 14px;
}

.dataset-search__button--primary {
  color: #ffffff;
  background: var(--color-blue);
}

.dataset-search__button--primary:hover {
  background: var(--color-blue-deep);
}

.dataset-search__button--publish,
.dataset-search__advanced,
.dataset-search__sort {
  border: 1px solid var(--color-border);
  color: var(--color-ink-soft);
  background: #ffffff;
}

.dataset-search__button--publish {
  color: var(--color-teal);
}

.dataset-search__advanced {
  padding: 0 12px;
}

.dataset-search__sort {
  padding: 0 8px 0 11px;
}

.dataset-search__sort span {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 600;
}

.dataset-search__sort select {
  border: 0;
  outline: 0;
  color: var(--color-ink-soft);
  background: transparent;
  font-weight: 700;
}

.dataset-search__hint {
  margin: -4px 0 0;
  color: var(--color-teal);
  font-size: 13px;
  line-height: 1.5;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 980px) {
  .dataset-search__row {
    grid-template-columns: minmax(220px, 1fr) auto auto;
  }

  .dataset-search__sort,
  .dataset-search__button--publish {
    justify-self: start;
  }
}

@media (max-width: 680px) {
  .dataset-search__row {
    grid-template-columns: 1fr;
  }

  .dataset-search__button,
  .dataset-search__advanced,
  .dataset-search__sort {
    width: 100%;
    white-space: normal;
  }

  .dataset-search__sort {
    justify-content: space-between;
  }
}
</style>
