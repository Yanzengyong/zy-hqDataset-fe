<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无数据',
  },
  description: {
    type: String,
    default: '当前没有可展示的内容。',
  },
})
</script>

<template>
  <section class="empty-state" aria-live="polite">
    <div class="empty-state__mark" aria-hidden="true"></div>
    <div>
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
  </section>
</template>

<style scoped>
.empty-state {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 0;
  color: var(--color-muted);
}

.empty-state__mark {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  margin-top: 1px;
  border: 1px solid rgba(183, 127, 33, 0.24);
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(183, 127, 33, 0.14), transparent 62%),
    var(--color-panel);
}

.empty-state h2 {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 15px;
  line-height: 1.45;
}

.empty-state p {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.6;
}
</style>
