<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <nav v-if="items.length" class="breadcrumb" aria-label="面包屑导航">
    <ol>
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`">
        <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
        <span v-else aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.5;
}

.breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.breadcrumb li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.breadcrumb li + li::before {
  color: var(--color-border-strong);
  content: ">";
}

.breadcrumb a {
  color: var(--color-blue);
}

.breadcrumb a:hover {
  color: var(--color-blue-deep);
}

.breadcrumb span {
  color: var(--color-ink-soft);
}
</style>
