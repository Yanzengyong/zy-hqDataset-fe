<script setup>
import { Pause, Play } from 'lucide-vue-next'

defineProps({
  stages: {
    type: Array,
    default: () => [],
  },
  activeStageId: {
    type: String,
    default: '',
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-play', 'select-stage'])
</script>

<template>
  <nav class="flow-controls" aria-label="构建流程控制">
    <button
      class="flow-controls__play"
      type="button"
      :aria-pressed="isPlaying"
      @click="$emit('toggle-play')"
    >
      <component :is="isPlaying ? Pause : Play" :size="18" :stroke-width="2" aria-hidden="true" />
      <span>{{ isPlaying ? '暂停流转' : '播放流转' }}</span>
    </button>

    <ul class="flow-controls__stages">
      <li
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="flow-controls__stage-item"
      >
        <button
          class="flow-controls__stage"
          :class="{ 'flow-controls__stage--active': stage.id === activeStageId }"
          type="button"
          :aria-current="stage.id === activeStageId ? 'step' : undefined"
          @click="$emit('select-stage', stage.id)"
        >
          <span class="flow-controls__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="flow-controls__name">{{ stage.title }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.flow-controls {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
  margin-top: 16px;
}

.flow-controls__play,
.flow-controls__stage {
  border: 1px solid rgba(169, 216, 216, 0.18);
  border-radius: 8px;
  color: rgba(237, 247, 246, 0.76);
  background: rgba(8, 22, 28, 0.72);
  transition:
    border-color 0.18s ease,
    color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.flow-controls__play:hover,
.flow-controls__stage:hover {
  transform: translateY(-1px);
  border-color: rgba(139, 214, 196, 0.48);
  color: #ffffff;
}

.flow-controls__play {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.flow-controls__stages {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.flow-controls__stage-item {
  display: flex;
  min-width: 0;
}

.flow-controls__stage {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  min-height: 46px;
  align-items: center;
  min-width: 0;
  width: 100%;
  padding: 8px 10px;
  text-align: left;
}

.flow-controls__stage--active {
  border-color: rgba(139, 214, 196, 0.72);
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(31, 138, 112, 0.22), rgba(47, 111, 187, 0.16)),
    rgba(8, 22, 28, 0.76);
  box-shadow: 0 0 0 1px rgba(139, 214, 196, 0.12);
}

.flow-controls__index {
  color: #8bd6c4;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.flow-controls__name {
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 980px) {
  .flow-controls {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .flow-controls__stages {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 430px) {
  .flow-controls__stages {
    grid-template-columns: 1fr;
  }
}
</style>
