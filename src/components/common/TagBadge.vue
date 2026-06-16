<script setup>
defineProps({
  tone: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'blue', 'green', 'gold', 'cyan', 'danger'].includes(value),
  },
})
</script>

<template>
  <span class="tag-badge" :class="`tag-badge--${tone}`">
    <slot />
  </span>
</template>

<style scoped>
.tag-badge {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  vertical-align: middle;
}

.tag-badge--default {
  border-color: var(--color-border);
  color: var(--color-ink-soft);
  background: var(--color-panel-subtle);
}

.tag-badge--blue {
  border-color: rgba(39, 92, 160, 0.2);
  color: var(--color-blue-deep);
  background: rgba(39, 92, 160, 0.09);
}

.tag-badge--green {
  border-color: rgba(47, 126, 85, 0.22);
  color: var(--color-green);
  background: rgba(47, 126, 85, 0.1);
}

.tag-badge--gold {
  border-color: rgba(183, 127, 33, 0.24);
  color: var(--color-gold);
  background: rgba(183, 127, 33, 0.11);
}

.tag-badge--cyan {
  border-color: rgba(18, 127, 132, 0.22);
  color: var(--color-teal);
  background: rgba(18, 127, 132, 0.09);
}

.tag-badge--danger {
  border-color: rgba(190, 62, 62, 0.22);
  color: var(--color-danger);
  background: rgba(190, 62, 62, 0.09);
}
</style>
