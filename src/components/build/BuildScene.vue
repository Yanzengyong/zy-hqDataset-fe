<script setup>
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

defineEmits(['select-stage'])
</script>

<template>
  <section class="pipeline-scene" aria-label="中医药数据构建流程">
    <div class="pipeline-scene__herb-glow" aria-hidden="true"></div>

    <ol class="pipeline-scene__modules">
      <li
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="pipeline-scene__module-item"
        :class="{
          'pipeline-scene__module-item--active': stage.id === activeStageId,
          'pipeline-scene__module-item--running': stage.id === activeStageId && isPlaying,
        }"
        :style="{ '--stage-accent': stage.accent }"
      >
        <button
          class="pipeline-module"
          :class="{
            'pipeline-module--active': stage.id === activeStageId,
            'pipeline-module--running': stage.id === activeStageId && isPlaying,
          }"
          type="button"
          :style="{ '--stage-accent': stage.accent, '--stage-index': index }"
          :aria-current="stage.id === activeStageId ? 'step' : undefined"
          @click="$emit('select-stage', stage.id)"
        >
          <span class="pipeline-module__scanner" aria-hidden="true"></span>
          <span class="pipeline-module__aura" aria-hidden="true"></span>

          <span class="pipeline-module__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="pipeline-module__title">{{ stage.title }}</span>
          <span class="pipeline-module__subtitle">{{ stage.subtitle }}</span>
          <span v-if="stage.id === activeStageId && isPlaying" class="pipeline-module__status">
            执行中
          </span>

          <span class="pipeline-module__nodes" aria-hidden="true">
            <i v-for="nodeIndex in 6" :key="nodeIndex"></i>
          </span>
        </button>

        <span v-if="index < stages.length - 1" class="pipeline-connector" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.pipeline-scene {
  position: relative;
  overflow: hidden;
  min-height: 400px;
  border: 1px solid rgba(169, 216, 216, 0.18);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 88%, rgba(31, 138, 112, 0.18), transparent 28%),
    radial-gradient(circle at 18% 34%, rgba(139, 214, 196, 0.12), transparent 26%),
    radial-gradient(circle at 82% 28%, rgba(127, 77, 255, 0.14), transparent 26%),
    linear-gradient(180deg, rgba(2, 18, 20, 0.9), rgba(5, 10, 18, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -44px 120px rgba(0, 0, 0, 0.38);
}

.pipeline-scene::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(rgba(139, 214, 196, 0.038) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 214, 196, 0.032) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: radial-gradient(circle at center, #000 10%, transparent 78%);
}

.pipeline-scene__herb-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 30% 78%, rgba(26, 92, 52, 0.32), transparent 22%),
    radial-gradient(ellipse at 58% 72%, rgba(29, 99, 82, 0.28), transparent 26%),
    radial-gradient(ellipse at 72% 68%, rgba(56, 42, 128, 0.22), transparent 24%);
  opacity: 0.9;
}

.pipeline-scene__modules {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(5, minmax(130px, 1fr));
  gap: 58px;
  align-items: center;
  min-height: 400px;
  margin: 0;
  padding: 74px 48px 58px;
  list-style: none;
}

.pipeline-scene__module-item {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.pipeline-scene__module-item--active {
  z-index: 2;
}

.pipeline-connector {
  position: absolute;
  left: calc(100% - 24px);
  top: 50%;
  z-index: 1;
  display: block;
  width: 102px;
  height: 226px;
  overflow: hidden;
  pointer-events: none;
  transform: translateY(-50%);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 24px 50%);
  mask-image: none;
}

.pipeline-connector::before,
.pipeline-connector::after {
  position: absolute;
  inset: 0;
  content: '';
}

.pipeline-connector::before {
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--stage-accent), #06171a 22%) 0%,
      color-mix(in srgb, var(--stage-accent), #06171a 38%) 24%,
      color-mix(in srgb, var(--stage-accent), #06171a 48%) 58%,
      color-mix(in srgb, var(--stage-accent), #06171a 70%) 100%
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.012), transparent 18%, rgba(255, 255, 255, 0.035) 50%, transparent 82%, rgba(255, 255, 255, 0.012));
  opacity: 0.5;
  box-shadow:
    inset 22px 0 26px color-mix(in srgb, var(--stage-accent), transparent 90%),
    inset -22px 0 30px rgba(5, 14, 22, 0.48),
    0 0 10px color-mix(in srgb, var(--stage-accent), transparent 94%);
}

.pipeline-connector::after {
  display: none;
}

.pipeline-connector i {
  position: absolute;
  inset: 0;
  display: block;
  clip-path: inherit;
  opacity: 0;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--stage-accent), transparent 94%),
      color-mix(in srgb, var(--stage-accent), #d9fff4 12%) 46%,
      color-mix(in srgb, var(--stage-accent), transparent 96%)
    ),
    linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.028) 50%, transparent);
  filter: blur(0.9px);
  mix-blend-mode: screen;
  transform: translateX(-108%);
}

.pipeline-scene__module-item--running .pipeline-connector i {
  animation: pipeline-connector-wave 2.2s linear infinite;
}

.pipeline-scene__module-item--running .pipeline-connector i:nth-child(2) {
  animation-delay: 0.34s;
}

.pipeline-scene__module-item--running .pipeline-connector i:nth-child(3) {
  animation-delay: 0.68s;
}

.pipeline-scene__module-item--running .pipeline-connector i:nth-child(4) {
  animation-delay: 1.02s;
}

.pipeline-scene__module-item--running .pipeline-connector i:nth-child(5) {
  animation-delay: 1.36s;
}

.pipeline-module {
  position: relative;
  z-index: 2;
  display: grid;
  width: 100%;
  min-height: 226px;
  align-content: start;
  gap: 8px;
  padding: 26px 24px 22px;
  border: 1px solid color-mix(in srgb, var(--stage-accent), transparent 40%);
  border-radius: 8px;
  color: rgba(237, 247, 246, 0.82);
  text-align: left;
  background:
    linear-gradient(110deg, color-mix(in srgb, var(--stage-accent), transparent 78%) 0 26%, transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015)),
    rgba(5, 22, 30, 0.76);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.035),
    0 18px 44px color-mix(in srgb, var(--stage-accent), transparent 86%);
  clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 20px 50%);
  transform: translateY(calc((var(--stage-index) % 2) * 22px));
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    filter 0.2s ease,
    transform 0.2s ease;
}

.pipeline-module::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--stage-accent), transparent 78%), transparent);
  opacity: 0;
  transform: translateX(-80%);
}

.pipeline-module:hover,
.pipeline-module--active {
  color: #ffffff;
  border-color: color-mix(in srgb, var(--stage-accent), #ffffff 18%);
  filter: drop-shadow(0 0 18px color-mix(in srgb, var(--stage-accent), transparent 40%));
  transform: translateY(calc((var(--stage-index) % 2) * 22px - 6px));
}

.pipeline-module--active::before {
  position: absolute;
  inset: -1px;
  pointer-events: none;
  content: '';
  border: 1px solid color-mix(in srgb, var(--stage-accent), #ffffff 24%);
  border-radius: 8px;
  clip-path: inherit;
}

.pipeline-module--running {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 18px color-mix(in srgb, var(--stage-accent), transparent 35%),
    0 24px 62px color-mix(in srgb, var(--stage-accent), transparent 72%);
}

.pipeline-module--running::after {
  opacity: 1;
  animation: pipeline-module-scan 1.4s ease-in-out infinite;
}

.pipeline-module__scanner,
.pipeline-module__aura {
  position: absolute;
  pointer-events: none;
}

.pipeline-module__scanner {
  inset: 0;
  opacity: 0;
  background:
    linear-gradient(180deg, transparent 0 42%, color-mix(in srgb, var(--stage-accent), transparent 52%) 50%, transparent 58%);
}

.pipeline-module--running .pipeline-module__scanner {
  opacity: 1;
  animation: pipeline-scanner 1.8s ease-in-out infinite;
}

.pipeline-module__aura {
  inset: -10px;
  border: 1px solid color-mix(in srgb, var(--stage-accent), transparent 32%);
  border-radius: 10px;
  opacity: 0;
  clip-path: inherit;
}

.pipeline-module--running .pipeline-module__aura {
  opacity: 1;
  animation: pipeline-aura 1.6s ease-in-out infinite;
}

.pipeline-module__index {
  color: color-mix(in srgb, var(--stage-accent), #ffffff 26%);
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
}

.pipeline-module__title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.32;
  overflow-wrap: anywhere;
}

.pipeline-module__subtitle {
  color: rgba(237, 247, 246, 0.52);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.pipeline-module__status {
  width: fit-content;
  margin-top: 2px;
  padding: 4px 8px;
  border: 1px solid color-mix(in srgb, var(--stage-accent), #ffffff 20%);
  border-radius: 999px;
  color: #ffffff;
  background: color-mix(in srgb, var(--stage-accent), transparent 72%);
  box-shadow: 0 0 16px color-mix(in srgb, var(--stage-accent), transparent 55%);
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
}

.pipeline-module__nodes {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
  padding: 14px;
  border: 1px solid rgba(169, 216, 216, 0.1);
  border-radius: 8px;
  background: rgba(1, 10, 16, 0.32);
}

.pipeline-module__nodes::before {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 50%;
  pointer-events: none;
  content: '';
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--stage-accent), transparent 42%), transparent);
}

.pipeline-module__nodes i {
  width: 11px;
  height: 11px;
  justify-self: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--stage-accent), #ffffff 20%);
  box-shadow:
    0 0 14px color-mix(in srgb, var(--stage-accent), transparent 18%),
    0 0 30px color-mix(in srgb, var(--stage-accent), transparent 64%);
}

.pipeline-module--running .pipeline-module__nodes i {
  animation: pipeline-node-spark 1.2s ease-in-out infinite;
}

.pipeline-module__nodes i:nth-child(2) { animation-delay: 0.08s; }
.pipeline-module__nodes i:nth-child(3) { animation-delay: 0.16s; }
.pipeline-module__nodes i:nth-child(4) { animation-delay: 0.24s; }
.pipeline-module__nodes i:nth-child(5) { animation-delay: 0.32s; }
.pipeline-module__nodes i:nth-child(6) { animation-delay: 0.4s; }

@keyframes pipeline-connector-wave {
  0% {
    opacity: 0;
    transform: translateX(-112%) scaleX(0.92);
  }

  18% {
    opacity: 0.08;
  }

  46% {
    opacity: 0.16;
  }

  72% {
    opacity: 0.07;
  }

  100% {
    opacity: 0;
    transform: translateX(112%) scaleX(1.04);
  }
}

@keyframes pipeline-module-scan {
  0% {
    transform: translateX(-80%);
  }

  58%,
  100% {
    transform: translateX(80%);
  }
}

@keyframes pipeline-scanner {
  0% {
    transform: translateY(-90%);
  }

  62%,
  100% {
    transform: translateY(90%);
  }
}

@keyframes pipeline-aura {
  0%,
  100% {
    opacity: 0.42;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.035);
  }
}

@keyframes pipeline-node-spark {
  0%,
  100% {
    opacity: 0.54;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.28);
  }
}

@media (max-width: 1120px) {
  .pipeline-scene {
    overflow-x: auto;
  }

  .pipeline-scene__modules {
    min-width: 1080px;
  }
}

@media (max-width: 720px) {
  .pipeline-scene {
    min-height: 340px;
  }

  .pipeline-scene__modules {
    min-height: 340px;
    padding: 56px 36px 44px;
  }

  .pipeline-module {
    min-height: 210px;
  }
}
</style>
