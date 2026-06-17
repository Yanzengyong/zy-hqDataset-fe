<script setup>
const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'rgb(250 244 227)',
  },
  gridColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.03)',
  },
  gridSize: {
    type: Number,
    default: 40,
  },
  blobColors: {
    type: Array,
    default: () => [
      'rgba(79, 70, 229, 0.3)',
      'rgba(6, 182, 212, 0.3)',
      'rgba(236, 72, 153, 0.2)',
      'rgba(59, 130, 246, 0.3)',
    ],
  },
  duration: {
    type: Number,
    default: 20,
  },
  showGrid: {
    type: Boolean,
    default: true,
  },
  showBlobs: {
    type: Boolean,
    default: true,
  },
  blurAmount: {
    type: Number,
    default: 80,
  },
  blobOpacity: {
    type: Number,
    default: 0.6,
  },
})
</script>

<template>
  <div 
    class="animated-bg"
    :style="{ background: backgroundColor }"
  >
    <!-- 网格叠加层 -->
    <div 
      v-if="showGrid"
      class="animated-bg__grid"
      :style="{
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }"
    ></div>

    <!-- 流动光斑 -->
    <template v-if="showBlobs">
      <div 
        v-for="(color, index) in blobColors.slice(0, 4)"
        :key="index"
        class="animated-bg__blob"
        :class="`animated-bg__blob--${index + 1}`"
        :style="{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: `${duration}s`,
          filter: `blur(${blurAmount}px)`,
          opacity: blobOpacity,
        }"
      ></div>
    </template>
  </div>
</template>

<style scoped>
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.animated-bg__grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}

.animated-bg__blob {
  position: absolute;
  border-radius: 50%;
  animation: float infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.animated-bg__blob--1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  animation-delay: 0s;
}

.animated-bg__blob--2 {
  bottom: -20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  animation-delay: -5s;
}

.animated-bg__blob--3 {
  top: 30%;
  left: 40%;
  width: 40vw;
  height: 40vw;
  animation-delay: -10s;
}

.animated-bg__blob--4 {
  bottom: 10%;
  left: 10%;
  width: 30vw;
  height: 30vw;
  animation-delay: -15s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(5%, 5%) scale(1.1) rotate(10deg); }
  66% { transform: translate(-5%, 10%) scale(0.9) rotate(-5deg); }
  100% { transform: translate(0, 0) scale(1) rotate(0deg); }
}
</style>
