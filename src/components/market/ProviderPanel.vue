<script setup>
import { computed } from 'vue'
import { Building2, Mail, ScrollText, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
})

const details = computed(() => [
  {
    label: '机构名称',
    value: props.dataset.providerInfo?.name ?? props.dataset.provider,
    icon: Building2,
  },
  {
    label: '联系方式',
    value: props.dataset.providerInfo?.contact ?? '暂无联系方式',
    icon: Mail,
  },
  {
    label: '授权许可',
    value: props.dataset.providerInfo?.license ?? '暂无许可说明',
    icon: ShieldCheck,
  },
  {
    label: '领域方向',
    value: props.dataset.domain,
    icon: ScrollText,
  },
])
</script>

<template>
  <aside class="provider-panel" aria-labelledby="provider-panel-title">
    <h2 id="provider-panel-title">数据提供方</h2>
    <dl>
      <div v-for="item in details" :key="item.label">
        <dt>
          <component :is="item.icon" :size="15" aria-hidden="true" />
          {{ item.label }}
        </dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped>
.provider-panel {
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-panel);
  box-shadow: 0 12px 30px rgba(24, 36, 51, 0.04);
}

.provider-panel h2 {
  margin: 0 0 14px;
  color: var(--color-ink);
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 0;
}

.provider-panel dl {
  display: grid;
  gap: 13px;
  margin: 0;
}

.provider-panel div {
  min-width: 0;
}

.provider-panel dt {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 5px;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
}

.provider-panel dd {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
</style>
