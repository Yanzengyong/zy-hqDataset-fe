<script setup>
import { computed } from 'vue'
import { Building2, ScrollText } from 'lucide-vue-next'

const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
})

const details = computed(() => [
  {
    label: '机构名称',
    value: '贵州中医药大学',
    icon: Building2,
  },
  // 暂时隐藏，后续需要时恢复 Mail、ShieldCheck 图标导入并取消注释。
  // {
  //   label: '联系方式',
  //   value: props.dataset.providerInfo?.contact ?? '暂无联系方式',
  //   icon: Mail,
  // },
  // {
  //   label: '授权许可',
  //   value: props.dataset.providerInfo?.license ?? '暂无许可说明',
  //   icon: ShieldCheck,
  // },
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
  border: 1px solid rgba(31, 141, 122, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 253, 246, 0.97), rgba(247, 251, 241, 0.94)),
    var(--color-panel);
  box-shadow: 0 14px 34px rgba(23, 74, 61, 0.07);
}

.provider-panel h2 {
  margin: 0 0 14px;
  color: #173f36;
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
  color: #66766f;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
}

.provider-panel dd {
  margin: 0;
  color: #30433c;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
</style>
