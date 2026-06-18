<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  activeCategory: {
    type: String,
    default: 'all',
  },
})

defineEmits({
  'select-category': (value) => typeof value === 'string',
})
</script>

<template>
  <aside class="filter-sidebar" aria-label="数据集分类目录">
    <div class="filter-sidebar__header">
      <h2>数据目录</h2>
      <button
        class="filter-sidebar__all"
        :class="{ 'is-active': activeCategory === 'all' }"
        type="button"
        @click="$emit('select-category', 'all')"
      >
        全部
      </button>
    </div>

    <div class="filter-sidebar__groups">
      <section
        v-for="category in categories"
        :key="category.id"
        class="filter-sidebar__group"
      >
        <button
          class="filter-sidebar__group-title"
          :class="{ 'is-active': activeCategory === category.id || activeCategory === category.name }"
          type="button"
          @click="$emit('select-category', category.id)"
        >
          {{ category.name }}
        </button>

        <div class="filter-sidebar__tags" :aria-label="`${category.name}标签`">
          <button
            v-for="tag in category.tags"
            :key="`${category.id}-${tag}`"
            class="filter-sidebar__tag"
            :class="{ 'is-active': activeCategory === tag }"
            type="button"
            @click="$emit('select-category', tag)"
          >
            {{ tag }}
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.filter-sidebar {
  padding: 18px;
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 253, 246, 0.96), rgba(247, 251, 241, 0.94)),
    var(--color-panel);
  box-shadow: 0 12px 28px rgba(23, 74, 61, 0.06);
}

.filter-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(31, 141, 122, 0.16);
}

.filter-sidebar__header h2 {
  margin: 0;
  color: #173f36;
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 0;
}

.filter-sidebar__all,
.filter-sidebar__group-title,
.filter-sidebar__tag {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: rgba(255, 253, 246, 0.95);
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.filter-sidebar__all {
  flex: 0 0 auto;
  padding: 5px 10px;
  color: #60746a;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.filter-sidebar__groups {
  display: grid;
  gap: 16px;
  padding-top: 16px;
}

.filter-sidebar__group {
  display: grid;
  gap: 9px;
}

.filter-sidebar__group-title {
  width: 100%;
  min-width: 0;
  padding: 8px 10px;
  color: #2f463d;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  text-align: left;
  overflow-wrap: anywhere;
}

.filter-sidebar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-sidebar__tag {
  min-width: 0;
  padding: 5px 9px;
  color: #62766c;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
  background: linear-gradient(135deg, rgba(31, 141, 122, 0.08), rgba(182, 138, 55, 0.04));
  box-shadow: 0 4px 10px rgba(23, 74, 61, 0.04);
}

.filter-sidebar__all:hover,
.filter-sidebar__group-title:hover,
.filter-sidebar__tag:hover,
.filter-sidebar__all.is-active,
.filter-sidebar__group-title.is-active,
.filter-sidebar__tag.is-active {
  border-color: rgba(31, 141, 122, 0.32);
  color: #0d675d;
  background: rgba(31, 141, 122, 0.1);
  box-shadow: inset 0 0 0 1px rgba(31, 141, 122, 0.04);
}

@media (max-width: 900px) {
  .filter-sidebar {
    padding: 14px;
  }

  .filter-sidebar__groups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .filter-sidebar__groups {
    grid-template-columns: 1fr;
  }
}
</style>
