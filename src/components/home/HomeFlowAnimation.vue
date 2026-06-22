<template>
  <figure class="home-flow" aria-label="中医药数据集构建流程">
    <img src="/images/index-00.png" alt="中医药（苗药）数据集构建流程图" class="home-flow__image" />
    <svg
      class="home-flow__overlay"
      viewBox="0 0 2027 776"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <filter id="flowGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#18c6bd" stop-opacity="0" />
          <stop offset="42%" stop-color="#18c6bd" stop-opacity="0.2" />
          <stop offset="72%" stop-color="#b68a37" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#9f57df" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g class="home-flow__paths">
        <path
          v-for="path in flowPaths"
          :key="path.id"
          :id="path.id"
          :d="path.d"
          :style="{ '--delay': path.delay }"
        />
      </g>

      <g class="home-flow__particles" filter="url(#flowGlow)">
        <circle
          v-for="particle in particles"
          :key="particle.id"
          :r="particle.r"
          :fill="particle.color"
        >
          <animate
            attributeName="opacity"
            values="0;0.88;0.88;0"
            keyTimes="0;0.12;0.82;1"
            :dur="particle.duration"
            repeatCount="indefinite"
            :begin="particle.delay"
          />
          <animateMotion
            :dur="particle.duration"
            repeatCount="indefinite"
            :begin="particle.delay"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.33 0 0.2 1"
          >
            <mpath :href="`#${particle.path}`" />
          </animateMotion>
        </circle>
      </g>

      <g class="home-flow__nodes" filter="url(#flowGlow)">
        <circle
          v-for="node in nodes"
          :key="node.id"
          :cx="node.x"
          :cy="node.y"
          :r="node.r"
          :class="node.type"
          :style="{ '--delay': node.delay }"
        />
      </g>

      <rect class="home-flow__scan" x="575" y="145" width="850" height="520" rx="10" />
    </svg>
  </figure>
</template>

<script setup>
const sourcePaths = [
  { id: 'source-text', d: 'M 322 123 C 430 124, 470 300, 620 320', delay: '0s' },
  { id: 'source-pdf', d: 'M 315 291 C 430 292, 480 374, 640 390', delay: '0.45s' },
  { id: 'source-web', d: 'M 314 494 C 430 494, 500 454, 655 450', delay: '0.9s' },
  { id: 'source-epub', d: 'M 520 545 C 585 540, 620 520, 675 510', delay: '1.35s' },
]

const outputPaths = [
  { id: 'output-train', d: 'M 1335 300 C 1460 270, 1530 215, 1700 205', delay: '1.8s' },
  { id: 'output-tune', d: 'M 1340 430 C 1515 420, 1590 380, 1785 380', delay: '2.15s' },
  { id: 'output-eval', d: 'M 1330 475 C 1510 500, 1595 550, 1780 550', delay: '2.5s' },
  { id: 'output-search', d: 'M 1320 565 C 1455 650, 1550 670, 1705 680', delay: '2.85s' },
]

const flowPaths = [...sourcePaths, ...outputPaths]

const particles = [
  ...flowPaths.flatMap((path, index) => {
    const isOutput = index >= sourcePaths.length
    const baseDelay = index * 0.34

    return [
      {
        id: `${path.id}-primary`,
        path: path.id,
        r: isOutput ? 5 : 4,
        color: isOutput ? '#1ccd73' : '#1ed7d0',
        delay: `${baseDelay}s`,
        duration: '4.6s',
      },
      {
        id: `${path.id}-accent`,
        path: path.id,
        r: 3,
        color: isOutput ? '#f0b94c' : '#b68a37',
        delay: `${baseDelay + 1.35}s`,
        duration: '4.6s',
      },
    ]
  }),
]

const nodes = [
  { id: 'extract', x: 690, y: 360, r: 15, type: 'is-source', delay: '0.2s' },
  { id: 'clean', x: 870, y: 448, r: 17, type: 'is-source', delay: '0.8s' },
  { id: 'label', x: 1050, y: 390, r: 18, type: 'is-process', delay: '1.4s' },
  { id: 'quality', x: 1235, y: 455, r: 18, type: 'is-process', delay: '2s' },
  { id: 'train', x: 1665, y: 210, r: 16, type: 'is-output', delay: '2.3s' },
  { id: 'tune', x: 1795, y: 380, r: 16, type: 'is-output', delay: '2.7s' },
  { id: 'eval', x: 1775, y: 550, r: 16, type: 'is-output', delay: '3.1s' },
  { id: 'search', x: 1695, y: 680, r: 16, type: 'is-output', delay: '3.5s' },
]
</script>

<style scoped>
.home-flow {
  position: relative;
  width: min(80%, 1520px);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(31, 141, 122, 0.12);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 253, 246, 0.92), rgba(239, 249, 243, 0.84)),
    rgba(255, 253, 246, 0.7);
  box-shadow: 0 22px 58px rgba(23, 74, 61, 0.13);
}

.home-flow::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.36) 45%, transparent 68%),
    radial-gradient(420px 180px at 76% 16%, rgba(182, 138, 55, 0.12), transparent 72%);
  mix-blend-mode: screen;
}

.home-flow__image {
  position: relative;
  z-index: 0;
  width: 100%;
  aspect-ratio: 2027 / 776;
  object-fit: contain;
}

.home-flow__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.home-flow__paths path {
  fill: none;
  stroke: rgba(31, 199, 190, 0.2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 8 12;
  animation: flow-line 4.6s linear infinite;
  animation-delay: var(--delay);
}

.home-flow__particles circle {
  opacity: 0;
}

.home-flow__nodes circle {
  opacity: 0;
  animation: node-pulse 4.2s ease-in-out infinite;
  animation-delay: var(--delay);
}

.home-flow__nodes .is-source {
  fill: rgba(30, 215, 208, 0.62);
}

.home-flow__nodes .is-process {
  fill: rgba(104, 91, 225, 0.58);
}

.home-flow__nodes .is-output {
  fill: rgba(28, 205, 115, 0.62);
}

.home-flow__scan {
  fill: url(#scanGradient);
  opacity: 0;
  transform-origin: center;
  animation: flow-scan 6.5s ease-in-out infinite;
}

@keyframes flow-line {
  to {
    stroke-dashoffset: -128;
  }
}

@keyframes node-pulse {
  0%, 18% {
    opacity: 0;
  }

  28%, 72% {
    opacity: 0.76;
  }

  100% {
    opacity: 0;
  }
}

@keyframes flow-scan {
  0%, 18% {
    opacity: 0;
    transform: translateX(-160px) skewX(-9deg);
  }

  38%, 62% {
    opacity: 0.65;
  }

  82%, 100% {
    opacity: 0;
    transform: translateX(190px) skewX(-9deg);
  }
}

@media (max-width: 1024px) {
  .home-flow {
    width: 92%;
  }
}

@media (max-width: 640px) {
  .home-flow {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-flow__paths path,
  .home-flow__nodes circle,
  .home-flow__scan {
    animation: none;
  }

  .home-flow__particles {
    display: none;
  }
}
</style>
