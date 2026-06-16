<script setup>
defineProps({
  text: {
    type: String,
    default: '数据加载中...',
  },
})
</script>

<template>
  <div class="loading-state" role="status" aria-live="polite">
    <span class="loading-state__spinner" aria-hidden="true"></span>
    <span>{{ text }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 10px 0;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.5;
}

.loading-state__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(39, 92, 160, 0.18);
  border-top-color: var(--color-blue);
  border-radius: 50%;
  animation: loading-state-spin 0.8s linear infinite;
}

@keyframes loading-state-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
