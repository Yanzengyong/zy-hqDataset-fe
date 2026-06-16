<script setup>
import { computed, ref } from 'vue'
import { BookOpen, ListChecks, Table2 } from 'lucide-vue-next'
import MetadataTable from './MetadataTable.vue'

const props = defineProps({
  dataset: {
    type: Object,
    required: true,
  },
})

const activeTab = ref('intro')

const tabs = [
  {
    id: 'intro',
    label: '数据介绍',
    icon: BookOpen,
  },
  {
    id: 'samples',
    label: '样例数据',
    icon: ListChecks,
  },
  {
    id: 'metadata',
    label: '元数据',
    icon: Table2,
  },
]

const metadata = computed(() => props.dataset.metadata ?? {})

const introSections = computed(() => [
  {
    title: '概览',
    body: props.dataset.summary,
  },
  {
    title: '适用场景',
    body: `${props.dataset.industry}，适用于${props.dataset.taskType}、模型训练、评测验证和数据治理演示。`,
  },
  {
    title: '数据来源',
    body: metadata.value.数据来源 ?? '暂无数据来源说明。',
  },
  {
    title: '标注规则',
    body: metadata.value.标注体系 ?? '暂无标注规则说明。',
  },
  {
    title: '质量控制',
    body: metadata.value.质检方式 ?? '暂无质量控制说明。',
  },
  {
    title: '使用限制',
    body: [
      metadata.value.是否需要授权使用 ? `授权要求：${metadata.value.是否需要授权使用}` : '',
      metadata.value.是否涉及个人信息 ? `合规说明：${metadata.value.是否涉及个人信息}` : '',
      props.dataset.providerInfo?.license ? `许可范围：${props.dataset.providerInfo.license}` : '',
    ].filter(Boolean).join('；') || '暂无使用限制说明。',
  },
])

const sampleRows = computed(() => (props.dataset.samples ?? []).slice(0, 3))
</script>

<template>
  <section class="dataset-tabs" aria-label="数据集详情内容">
    <div class="dataset-tabs__nav" role="tablist" aria-label="详情切换">
      <button
        v-for="tab in tabs"
        :id="`dataset-tab-${tab.id}`"
        :key="tab.id"
        class="dataset-tabs__tab"
        :class="{ 'is-active': activeTab === tab.id }"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`dataset-panel-${tab.id}`"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" :size="16" aria-hidden="true" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div
      v-show="activeTab === 'intro'"
      id="dataset-panel-intro"
      class="dataset-tabs__panel"
      role="tabpanel"
      aria-labelledby="dataset-tab-intro"
    >
      <section
        v-for="section in introSections"
        :key="section.title"
        class="dataset-tabs__section"
      >
        <h2>{{ section.title }}</h2>
        <p>{{ section.body }}</p>
      </section>
    </div>

    <div
      v-show="activeTab === 'samples'"
      id="dataset-panel-samples"
      class="dataset-tabs__panel"
      role="tabpanel"
      aria-labelledby="dataset-tab-samples"
    >
      <div v-if="sampleRows.length" class="dataset-tabs__samples">
        <article
          v-for="(sample, index) in sampleRows"
          :key="`${dataset.id}-sample-${index}`"
          class="dataset-tabs__sample"
        >
          <div class="dataset-tabs__sample-index">样例 {{ index + 1 }}</div>
          <dl>
            <div>
              <dt>输入</dt>
              <dd>{{ sample.input }}</dd>
            </div>
            <div>
              <dt>输出</dt>
              <dd>{{ sample.output }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <p v-else class="dataset-tabs__empty">暂无样例数据。</p>
    </div>

    <div
      v-show="activeTab === 'metadata'"
      id="dataset-panel-metadata"
      class="dataset-tabs__panel"
      role="tabpanel"
      aria-labelledby="dataset-tab-metadata"
    >
      <MetadataTable :metadata="dataset.metadata" />
    </div>
  </section>
</template>

<style scoped>
.dataset-tabs {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-panel);
  box-shadow: 0 12px 30px rgba(24, 36, 51, 0.04);
}

.dataset-tabs__nav {
  display: flex;
  gap: 2px;
  padding: 8px;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.dataset-tabs__tab {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border-radius: 6px;
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.dataset-tabs__tab:hover,
.dataset-tabs__tab.is-active {
  color: var(--color-blue-deep);
  background: rgba(39, 92, 160, 0.09);
}

.dataset-tabs__panel {
  padding: 20px;
}

.dataset-tabs__section + .dataset-tabs__section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border);
}

.dataset-tabs__section h2 {
  margin: 0 0 7px;
  color: var(--color-ink);
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: 0;
}

.dataset-tabs__section p,
.dataset-tabs__empty {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 14px;
  line-height: 1.8;
}

.dataset-tabs__samples {
  display: grid;
  gap: 12px;
}

.dataset-tabs__sample {
  padding: 15px;
  border: 1px solid rgba(39, 92, 160, 0.14);
  border-radius: 8px;
  background: #f8fbff;
}

.dataset-tabs__sample-index {
  margin-bottom: 10px;
  color: var(--color-blue-deep);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.dataset-tabs__sample dl {
  display: grid;
  gap: 9px;
  margin: 0;
}

.dataset-tabs__sample div {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 10px;
}

.dataset-tabs__sample dt {
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.6;
}

.dataset-tabs__sample dd {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

@media (max-width: 560px) {
  .dataset-tabs__panel {
    padding: 16px;
  }

  .dataset-tabs__sample div {
    grid-template-columns: 1fr;
    gap: 3px;
  }
}
</style>
