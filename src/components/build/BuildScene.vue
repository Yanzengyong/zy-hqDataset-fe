<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import tcmHerbsImage from '../../assets/annotation/tcm-herbs.png'
import tcmPrescriptionImage from '../../assets/annotation/tcm-prescription.png'
import tcmPulseImage from '../../assets/annotation/tcm-pulse.png'

const annotationImages = [
  { src: tcmHerbsImage, alt: '中药材标注样本' },
  { src: tcmPulseImage, alt: '脉诊标注样本' },
  { src: tcmPrescriptionImage, alt: '处方标注样本' },
]

const props = defineProps({
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

const sourceVisual = ref(null)
const qualityVisual = ref(null)
let sourceTimeline = null
let qualityTimeline = null
let qualitySlotOrder = []
let qualitySlotCursor = 0

const qualitySlots = [
  { left: 34, top: 34 },
  { left: 66, top: 34 },
  { left: 36, top: 66 },
  { left: 66, top: 66 },
]

const setSourceVisual = (element) => {
  if (element) {
    sourceVisual.value = element
  }
}

const setQualityVisual = (element) => {
  if (element) {
    qualityVisual.value = element
  }
}

const resetSourceFlights = () => {
  sourceTimeline?.kill()
  sourceTimeline = null

  if (!sourceVisual.value) {
    return
  }

  gsap.set(sourceVisual.value.querySelectorAll('.pipeline-source-flight'), {
    clearProps: 'transform',
    opacity: 0,
    scale: 1,
  })
}

const resetQualityWords = () => {
  qualityTimeline?.kill()
  qualityTimeline = null
  qualitySlotOrder = []
  qualitySlotCursor = 0

  if (!qualityVisual.value) {
    return
  }

  gsap.set(qualityVisual.value.querySelectorAll('i'), {
    opacity: 0,
    filter: 'blur(1.6px)',
    left: '50%',
    top: '50%',
    xPercent: -50,
    yPercent: -50,
    scale: 0.92,
    x: 0,
    y: 0,
  })
}

const shuffleQualitySlots = () => {
  qualitySlotOrder = gsap.utils.shuffle([...qualitySlots])
  qualitySlotCursor = 0
}

const setRandomQualityPosition = (word) => {
  if (qualitySlotCursor === 0 || qualitySlotCursor >= qualitySlotOrder.length) {
    shuffleQualitySlots()
  }

  const slot = qualitySlotOrder[qualitySlotCursor]
  qualitySlotCursor += 1

  gsap.set(word, {
    left: `${slot.left}%`,
    top: `${slot.top}%`,
    xPercent: -50,
    yPercent: -50,
    x: gsap.utils.random(-4, 4),
    y: gsap.utils.random(-4, 4),
  })
}

const getSourceFlightVector = (node, target) => {
  const nodeRect = node.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  return {
    x: targetRect.left + targetRect.width / 2 - (nodeRect.left + nodeRect.width / 2),
    y: targetRect.top + targetRect.height / 2 - (nodeRect.top + nodeRect.height / 2),
  }
}

const addSourceFlight = (timeline, node, target, at, duration = 1.08) => {
  const vector = getSourceFlightVector(node, target)

  timeline
    .fromTo(node, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 0,
      filter: 'brightness(1)',
    }, {
      opacity: 0.9,
      duration: 0.08,
      ease: 'none',
    }, at)
    .to(node, {
      x: vector.x,
      y: vector.y,
      scale: 0.1,
      opacity: 0.88,
      filter: 'brightness(1)',
      duration: duration * 0.82,
      ease: 'power3.inOut',
    }, at + 0.03)
    .to(node, {
      opacity: 0,
      filter: 'brightness(0.62)',
      duration: duration * 0.22,
      ease: 'power1.out',
    }, at + duration * 0.78)
}

const playSourceFlights = async () => {
  await nextTick()
  resetSourceFlights()

  if (!sourceVisual.value || props.activeStageId !== 'source' || !props.isPlaying) {
    return
  }

  const text = sourceVisual.value.querySelector('.pipeline-source-flight--text')
  const image = sourceVisual.value.querySelector('.pipeline-source-flight--image')
  const api = sourceVisual.value.querySelector('.pipeline-source-flight--api')
  const core = sourceVisual.value.querySelector('.pipeline-source-core')

  if (!text || !image || !api || !core) {
    return
  }

  sourceTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.58 })

  sourceTimeline
    .set([text, image, api], { opacity: 0, scale: 1, x: 0, y: 0 })
    .to(core, {
      scale: 1.18,
      duration: 0.18,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      transformOrigin: '50% 50%',
    }, 0.92)

  addSourceFlight(sourceTimeline, api, core, 0, 1.25)
  addSourceFlight(sourceTimeline, text, core, 0.38, 1.35)
  addSourceFlight(sourceTimeline, image, core, 0.58, 1.35)
}

const playQualityWords = async () => {
  await nextTick()
  resetQualityWords()

  if (!qualityVisual.value || props.activeStageId !== 'quality' || !props.isPlaying) {
    return
  }

  const words = [...qualityVisual.value.querySelectorAll('i')]
  qualityTimeline = gsap.timeline({ repeat: -1 })

  words.forEach((word, index) => {
    qualityTimeline
      .call(() => setRandomQualityPosition(word), null, index * 0.38)
      .fromTo(word, {
        opacity: 0,
        filter: 'blur(1.6px)',
        scale: 0.9,
      }, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.28,
        ease: 'power2.out',
      }, index * 0.38)
      .to(word, {
        opacity: 0,
        filter: 'blur(1.4px)',
        scale: 0.94,
        duration: 0.42,
        ease: 'power2.in',
      }, index * 0.38 + 1.05)
  })
}

watch(
  () => [props.activeStageId, props.isPlaying],
  () => {
    playSourceFlights()
    playQualityWords()
  },
  { immediate: true },
)

onMounted(() => {
  playSourceFlights()
  playQualityWords()
})

onUnmounted(() => {
  resetSourceFlights()
  resetQualityWords()
})
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

          <span
            class="pipeline-module__visual"
            :class="`pipeline-module__visual--${stage.id}`"
            :ref="stage.id === 'source' ? setSourceVisual : stage.id === 'quality' ? setQualityVisual : undefined"
            aria-hidden="true"
          >
            <template v-if="stage.id === 'source'">
              <i>文</i>
              <i>图</i>
              <i>API</i>
              <span class="pipeline-source-flight pipeline-source-flight--text">文</span>
              <span class="pipeline-source-flight pipeline-source-flight--image">图</span>
              <span class="pipeline-source-flight pipeline-source-flight--api">API</span>
              <b class="pipeline-source-core"></b>
            </template>

            <template v-else-if="stage.id === 'collect'">
              <i>文</i>
              <i>图</i>
              <span>A</span>
              <span>K</span>
              <span>M</span>
              <span>R</span>
              <span>T</span>
              <span>D</span>
              <span>N</span>
              <span>S</span>
              <span>E</span>
              <span>Q</span>
              <b></b>
              <b></b>
              <b></b>
            </template>

            <template v-else-if="stage.id === 'annotate'">
              <span
                v-for="(image, imageIndex) in annotationImages"
                :key="image.src"
                class="pipeline-annotate-frame"
                :style="{ '--annotate-frame-index': imageIndex }"
              >
                <img :src="image.src" :alt="image.alt" />
                <i></i>
                <i></i>
                <i></i>
              </span>
            </template>

            <template v-else-if="stage.id === 'quality'">
              <i>字段完整性</i>
              <i>标注一致性</i>
              <i>可追溯性</i>
              <i>标签准确性</i>
            </template>

            <template v-else>
              <i></i>
              <i></i>
              <i></i>
              <b></b>
            </template>
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
    0 0 24px color-mix(in srgb, var(--stage-accent), transparent 28%),
    0 28px 72px color-mix(in srgb, var(--stage-accent), transparent 68%);
  transform: translateY(calc((var(--stage-index) % 2) * 22px - 9px)) scale(1.05);
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

.pipeline-module__visual {
  position: relative;
  display: block;
  overflow: hidden;
  min-height: 76px;
  margin-top: 20px;
  padding: 14px;
  border: 1px solid rgba(169, 216, 216, 0.1);
  border-radius: 8px;
  background: rgba(1, 10, 16, 0.32);
  transform-origin: center;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.pipeline-module__visual::before,
.pipeline-module__visual::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
}

.pipeline-module__visual::before {
  background:
    linear-gradient(90deg, transparent, color-mix(in srgb, var(--stage-accent), transparent 78%), transparent);
  opacity: 0.42;
  transform: translateX(-80%);
}

.pipeline-module__visual::after {
  border: 1px solid color-mix(in srgb, var(--stage-accent), transparent 44%);
  border-radius: inherit;
  background:
    linear-gradient(90deg, transparent 0 18%, color-mix(in srgb, var(--stage-accent), #ffffff 18%) 36%, transparent 54%),
    linear-gradient(180deg, transparent 0 24%, color-mix(in srgb, var(--stage-accent), #ffffff 26%) 50%, transparent 76%);
  background-size: 220% 100%, 100% 220%;
  mix-blend-mode: screen;
  opacity: 0;
  filter: blur(0.3px);
}

.pipeline-module--running .pipeline-module__visual::before {
  animation: pipeline-visual-sweep 1.6s ease-in-out infinite;
}

.pipeline-module--running .pipeline-module__visual {
  width: calc(100% - 18px);
  min-height: 86px;
  margin-right: auto;
  margin-left: auto;
  border-color: color-mix(in srgb, var(--stage-accent), #ffffff 12%);
  box-shadow:
    inset 0 0 18px color-mix(in srgb, var(--stage-accent), transparent 78%),
    0 0 22px color-mix(in srgb, var(--stage-accent), transparent 58%);
  transform: scale(1.02);
}

.pipeline-module--running .pipeline-module__visual::after {
  opacity: 0.72;
  animation: pipeline-visual-ripple-border 2.2s linear infinite;
}

.pipeline-module__visual i,
.pipeline-module__visual b,
.pipeline-module__visual strong {
  position: absolute;
  z-index: 1;
}

.pipeline-module__visual--source i {
  display: grid;
  width: 28px;
  height: 22px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--stage-accent), #ffffff 12%);
  border-radius: 5px;
  color: rgba(237, 247, 246, 0.92);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent),
    color-mix(in srgb, var(--stage-accent), #06171a 54%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 14px color-mix(in srgb, var(--stage-accent), transparent 70%);
  font-size: 10px;
  font-style: normal;
  font-weight: 900;
  line-height: 1;
  opacity: 0.92;
  transform-origin: center;
}

.pipeline-module__visual--source i:nth-child(1) {
  left: 10px;
  top: 12px;
}

.pipeline-module__visual--source i:nth-child(2) {
  left: 10px;
  bottom: 12px;
}

.pipeline-module__visual--source i:nth-child(3) {
  left: 48px;
  top: 27px;
  width: 34px;
}

.pipeline-module__visual--source b {
  z-index: 3;
  right: 18px;
  top: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--stage-accent), #ffffff 20%);
  box-shadow: 0 0 24px color-mix(in srgb, var(--stage-accent), transparent 36%);
  transform: translateY(-50%);
}

.pipeline-module__visual--source::after {
  position: absolute;
  left: 38px;
  right: 42px;
  top: 50%;
  height: 1px;
  content: '';
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--stage-accent), transparent 42%));
  opacity: 0.34;
}

.pipeline-source-flight {
  position: absolute;
  z-index: 2;
  display: grid;
  width: 28px;
  height: 22px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--stage-accent), #ffffff 18%);
  border-radius: 5px;
  color: rgba(237, 247, 246, 0.95);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent),
    color-mix(in srgb, var(--stage-accent), #06171a 42%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.045),
    0 0 16px color-mix(in srgb, var(--stage-accent), transparent 56%);
  font-size: 10px;
  font-weight: 900;
  line-height: 1;
  opacity: 0;
  pointer-events: none;
  transform-origin: center;
}

.pipeline-source-flight--text {
  left: 10px;
  top: 12px;
}

.pipeline-source-flight--image {
  left: 10px;
  bottom: 12px;
}

.pipeline-source-flight--api {
  left: 48px;
  top: 27px;
  width: 34px;
}

.pipeline-module__visual--collect i {
  display: grid;
  width: 28px;
  height: 20px;
  place-items: center;
  border-radius: 5px;
  color: rgba(237, 247, 246, 0.75);
  background: color-mix(in srgb, var(--stage-accent), transparent 78%);
  font-size: 10px;
  font-style: normal;
  font-weight: 900;
}

.pipeline-module__visual--collect i:nth-child(1) { left: 12px; top: 14px; }
.pipeline-module__visual--collect i:nth-child(2) { left: 12px; bottom: 14px; }

.pipeline-module__visual--collect b {
  left: 58px;
  right: 12px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--stage-accent), transparent 70%), transparent);
}

.pipeline-module__visual--collect b:nth-of-type(1) { top: 17px; opacity: 0.48; }
.pipeline-module__visual--collect b:nth-of-type(2) { top: 34px; opacity: 0.72; }
.pipeline-module__visual--collect b:nth-of-type(3) { top: 51px; opacity: 0.5; }

.pipeline-module__visual--collect span {
  position: absolute;
  z-index: 2;
  display: grid;
  width: 14px;
  height: 14px;
  place-items: center;
  border-radius: 4px;
  color: color-mix(in srgb, var(--stage-accent), #ffffff 30%);
  background: color-mix(in srgb, var(--stage-accent), #06171a 52%);
  box-shadow: 0 0 12px color-mix(in srgb, var(--stage-accent), transparent 62%);
  font-size: 9px;
  font-weight: 900;
  line-height: 1;
  opacity: 0;
}

.pipeline-module__visual--collect span:nth-of-type(1) { --letter-drift-y: -4px; left: 28px; top: 16px; }
.pipeline-module__visual--collect span:nth-of-type(2) { --letter-drift-y: 4px; left: 28px; top: 50px; }
.pipeline-module__visual--collect span:nth-of-type(3) { --letter-drift-y: 6px; left: 40px; top: 22px; }
.pipeline-module__visual--collect span:nth-of-type(4) { --letter-drift-y: -6px; left: 38px; top: 44px; }
.pipeline-module__visual--collect span:nth-of-type(5) { --letter-drift-y: 0; left: 48px; top: 34px; }
.pipeline-module__visual--collect span:nth-of-type(6) { --letter-drift-y: -3px; left: 18px; top: 24px; }
.pipeline-module__visual--collect span:nth-of-type(7) { --letter-drift-y: 5px; left: 18px; top: 42px; }
.pipeline-module__visual--collect span:nth-of-type(8) { --letter-drift-y: -7px; left: 52px; top: 18px; }
.pipeline-module__visual--collect span:nth-of-type(9) { --letter-drift-y: 7px; left: 52px; top: 50px; }
.pipeline-module__visual--collect span:nth-of-type(10) { --letter-drift-y: 1px; left: 62px; top: 34px; }

.pipeline-module--running .pipeline-module__visual--collect i {
  animation: pipeline-collect-chip 2.1s ease-in-out infinite;
}

.pipeline-module--running .pipeline-module__visual--collect b {
  animation: pipeline-collect-row 2.1s ease-in-out infinite;
}

.pipeline-module--running .pipeline-module__visual--collect span {
  animation: pipeline-collect-letter 2.05s cubic-bezier(0.32, 0.72, 0.18, 1) infinite;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(2) {
  animation-delay: 0.18s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(3) {
  animation-delay: 0.36s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(4) {
  animation-delay: 0.54s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(5) {
  animation-delay: 0.72s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(6) {
  animation-delay: 0.9s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(7) {
  animation-delay: 1.08s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(8) {
  animation-delay: 1.26s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(9) {
  animation-delay: 1.44s;
}

.pipeline-module--running .pipeline-module__visual--collect span:nth-of-type(10) {
  animation-delay: 1.62s;
}

.pipeline-annotate-frame {
  position: absolute;
  inset: 8px;
  z-index: 1;
  overflow: hidden;
  border-radius: 6px;
  opacity: 0;
  background: rgba(0, 0, 0, 0.18);
}

.pipeline-annotate-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.78;
  transform: scale(1.04);
}

.pipeline-module__visual--annotate::after {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 50%;
  z-index: 0;
  height: 1px;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.34), transparent);
  opacity: 0.68;
  pointer-events: none;
}

.pipeline-module--running .pipeline-module__visual--annotate::after {
  display: none;
}

.pipeline-annotate-frame i {
  position: absolute;
  border: 2px solid rgba(255, 76, 76, 0.9);
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(255, 76, 76, 0.34);
  opacity: 0;
}

.pipeline-annotate-frame i:nth-of-type(1) {
  left: 13%;
  top: 18%;
  width: 32%;
  height: 30%;
  border-color: rgba(255, 82, 82, 0.92);
  box-shadow: 0 0 12px rgba(255, 82, 82, 0.34);
}

.pipeline-annotate-frame i:nth-of-type(2) {
  right: 12%;
  top: 24%;
  width: 28%;
  height: 24%;
  border-color: rgba(75, 145, 255, 0.92);
  box-shadow: 0 0 12px rgba(75, 145, 255, 0.34);
}

.pipeline-annotate-frame i:nth-of-type(3) {
  left: 30%;
  bottom: 14%;
  width: 42%;
  height: 26%;
  border-color: rgba(82, 232, 143, 0.92);
  box-shadow: 0 0 12px rgba(82, 232, 143, 0.34);
}

.pipeline-module--running .pipeline-annotate-frame {
  animation: pipeline-annotate-frame 6s ease-in-out infinite;
  animation-delay: calc(var(--annotate-frame-index) * 2s);
}

.pipeline-module--running .pipeline-annotate-frame i {
  animation: pipeline-annotate-mark 6s ease-in-out infinite;
  animation-delay: calc(var(--annotate-frame-index) * 2s + 0.28s);
}

.pipeline-module--running .pipeline-annotate-frame i:nth-of-type(2) {
  animation-delay: calc(var(--annotate-frame-index) * 2s + 0.42s);
}

.pipeline-module--running .pipeline-annotate-frame i:nth-of-type(3) {
  animation-delay: calc(var(--annotate-frame-index) * 2s + 0.56s);
}

.pipeline-module__visual--quality i {
  display: grid;
  left: 50%;
  top: 50%;
  min-width: 64px;
  min-height: 25px;
  place-items: center;
  padding: 0 9px;
  border: 1px solid color-mix(in srgb, var(--stage-accent), transparent 48%);
  border-radius: 999px;
  color: rgba(237, 247, 246, 0.92);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent),
    color-mix(in srgb, var(--stage-accent), #06171a 56%);
  box-shadow: 0 0 16px color-mix(in srgb, var(--stage-accent), transparent 72%);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
  line-height: 1;
  opacity: 0;
  white-space: nowrap;
  transform: translate(-50%, -50%) scale(0.9);
}

.pipeline-module__visual--quality i:nth-child(1) {
  --quality-shift-x: 16px;
  --quality-shift-y: -10px;
  left: 22%;
  top: 26%;
  animation-delay: 0s;
}

.pipeline-module__visual--quality i:nth-child(2) {
  --quality-shift-x: -18px;
  --quality-shift-y: 12px;
  left: 74%;
  top: 28%;
  animation-delay: 0.36s;
}

.pipeline-module__visual--quality i:nth-child(3) {
  --quality-shift-x: -14px;
  --quality-shift-y: -12px;
  left: 78%;
  top: 76%;
  animation-delay: 0.72s;
}

.pipeline-module__visual--quality i:nth-child(4) {
  --quality-shift-x: 18px;
  --quality-shift-y: 10px;
  left: 24%;
  top: 76%;
  animation-delay: 1.08s;
}

.pipeline-module__visual--quality::after {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 50%;
  height: 1px;
  content: '';
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--stage-accent), transparent 46%), transparent);
  opacity: 0.58;
}

.pipeline-module__visual--product i {
  left: 10px;
  top: 20px;
  width: 34px;
  height: 30px;
  border: 1px solid color-mix(in srgb, var(--stage-accent), #ffffff 12%);
  border-radius: 6px;
  opacity: 0.42;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--stage-accent), transparent 58%) 0 49%, transparent 50%),
    linear-gradient(45deg, transparent 0 49%, rgba(255, 255, 255, 0.18) 50% 53%, transparent 54%),
    color-mix(in srgb, var(--stage-accent), #06171a 50%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.035),
    0 0 14px color-mix(in srgb, var(--stage-accent), transparent 68%);
}

.pipeline-module__visual--product i::before,
.pipeline-module__visual--product i::after {
  position: absolute;
  content: '';
}

.pipeline-module__visual--product i::before {
  left: 6px;
  right: 6px;
  top: 9px;
  height: 1px;
  background: rgba(255, 255, 255, 0.26);
}

.pipeline-module__visual--product i::after {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.18);
}

.pipeline-module__visual--product b {
  left: 24px;
  right: 24px;
  bottom: 12px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--stage-accent), #ffffff 12%), transparent);
}

.pipeline-module--running .pipeline-module__visual--product i:nth-child(1) {
  animation: pipeline-product-pack 2.7s linear infinite;
}

.pipeline-module--running .pipeline-module__visual--product i:nth-child(2),
.pipeline-module--running .pipeline-module__visual--product i:nth-child(3) {
  animation-name: pipeline-product-pack;
  animation-duration: 2.7s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.pipeline-module--running .pipeline-module__visual--product i:nth-child(2) {
  animation-delay: 0.52s;
}

.pipeline-module--running .pipeline-module__visual--product i:nth-child(3) {
  animation-delay: 1.04s;
}

.pipeline-module--running .pipeline-module__visual--product b {
  animation: pipeline-product-seal 2.1s ease-in-out infinite;
}

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

@keyframes pipeline-visual-sweep {
  0% {
    opacity: 0;
    transform: translateX(-90%);
  }

  42% {
    opacity: 0.42;
  }

  100% {
    opacity: 0;
    transform: translateX(90%);
  }
}

@keyframes pipeline-visual-ripple-border {
  0% {
    background-position: 120% 0, 0 120%;
    opacity: 0.34;
  }

  42% {
    opacity: 0.78;
  }

  100% {
    background-position: -120% 0, 0 -120%;
    opacity: 0.34;
  }
}

@keyframes pipeline-collect-chip {
  0%,
  100% {
    opacity: 0.54;
    transform: translateX(0);
  }

  50% {
    opacity: 1;
    transform: translateX(12px);
  }
}

@keyframes pipeline-collect-row {
  0%,
  100% {
    opacity: 0.28;
    transform: scaleX(0.64);
  }

  50% {
    opacity: 0.56;
    transform: scaleX(1);
  }
}

@keyframes pipeline-collect-letter {
  0% {
    opacity: 0;
    filter: brightness(1);
    transform: translate(0, 0) scale(1);
  }

  12% {
    opacity: 0.92;
  }

  74% {
    opacity: 0.92;
    filter: brightness(1);
    transform: translate(220px, var(--letter-drift-y, 0)) scale(0.72);
  }

  99% {
    opacity: 0.92;
    filter: brightness(1);
    transform: translate(255px, var(--letter-drift-y, 0)) scale(0.42);
  }

  100% {
    opacity: 0;
    filter: brightness(1);
    transform: translate(255px, var(--letter-drift-y, 0)) scale(0.42);
  }
}

@keyframes pipeline-annotate-frame {
  0%,
  30%,
  100% {
    opacity: 0;
    transform: scale(0.98);
  }

  4%,
  24% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pipeline-annotate-mark {
  0%,
  4%,
  30%,
  100% {
    opacity: 0;
    transform: scale(0.92);
  }

  8%,
  23% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pipeline-product-pack {
  0% {
    opacity: 0;
    transform: translateX(-18px) scale(0.88);
  }

  12% {
    opacity: 0.9;
  }

  72% {
    opacity: 0.9;
    transform: translateX(198px) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateX(230px) scale(0.82);
  }
}

@keyframes pipeline-product-seal {
  0%,
  100% {
    opacity: 0.38;
    transform: scaleX(0.58);
  }

  50% {
    opacity: 1;
    transform: scaleX(1);
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
