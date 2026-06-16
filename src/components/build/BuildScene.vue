<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'

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

const emit = defineEmits(['select-stage'])

const sceneRoot = ref(null)
const canvasHost = ref(null)
const hasWebGL = ref(true)

let scene
let camera
let renderer
let raycaster
let pointer
let resizeObserver
let animationFrame = 0
let core
let nodeGroup
let particleField
const nodeMeshes = []
const disposableItems = []

const fallbackPosition = (index) => {
  const positions = [
    { left: '50%', top: '13%' },
    { left: '84%', top: '48%' },
    { left: '50%', top: '84%' },
    { left: '16%', top: '48%' },
  ]

  return positions[index % positions.length]
}

const track = (item) => {
  disposableItems.push(item)
  return item
}

const disposeScene = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }

  resizeObserver?.disconnect()
  resizeObserver = null

  renderer?.domElement?.removeEventListener('pointerdown', handlePointerDown)
  renderer?.dispose()

  disposableItems.forEach((item) => {
    item.geometry?.dispose?.()
    item.material?.dispose?.()
    item.dispose?.()
  })

  scene = null
  camera = null
  renderer = null
  raycaster = null
  pointer = null
  core = null
  nodeGroup = null
  particleField = null
  nodeMeshes.length = 0
  disposableItems.length = 0
}

const resizeRenderer = () => {
  if (!renderer || !camera || !canvasHost.value) {
    return
  }

  const { width, height } = canvasHost.value.getBoundingClientRect()

  if (!width || !height) {
    return
  }

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

const updateActiveNode = () => {
  nodeMeshes.forEach(({ mesh, halo, stage }) => {
    const isActive = stage.id === props.activeStageId
    mesh.scale.setScalar(isActive ? 1.42 : 1)
    mesh.material.color.set(isActive ? '#ffffff' : stage.accent)
    mesh.material.emissive.set(stage.accent)
    mesh.material.emissiveIntensity = isActive ? 1.8 : 0.72
    halo.material.opacity = isActive ? 0.44 : 0.16
    halo.scale.setScalar(isActive ? 1.42 : 1)
  })
}

function handlePointerDown(event) {
  if (!renderer || !camera || !raycaster) {
    return
  }

  const rect = renderer.domElement.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)

  const intersections = raycaster.intersectObjects(nodeMeshes.map(({ mesh }) => mesh), false)
  const selectedStageId = intersections[0]?.object?.userData?.stageId

  if (selectedStageId) {
    emit('select-stage', selectedStageId)
  }
}

const createStageNodes = () => {
  nodeGroup = new THREE.Group()
  scene.add(nodeGroup)

  const lineMaterial = track(new THREE.LineBasicMaterial({
    color: 0x7ad7c6,
    transparent: true,
    opacity: 0.28,
  }))

  props.stages.forEach((stage, index) => {
    const angle = (index / props.stages.length) * Math.PI * 2 - Math.PI / 2
    const radius = 2.45
    const position = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)

    const nodeGeometry = track(new THREE.SphereGeometry(0.18, 32, 32))
    const nodeMaterial = track(new THREE.MeshStandardMaterial({
      color: stage.accent,
      emissive: stage.accent,
      emissiveIntensity: 0.72,
      roughness: 0.28,
      metalness: 0.2,
    }))
    const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
    mesh.position.copy(position)
    mesh.userData.stageId = stage.id
    nodeGroup.add(mesh)

    const haloGeometry = track(new THREE.TorusGeometry(0.32, 0.01, 12, 72))
    const haloMaterial = track(new THREE.MeshBasicMaterial({
      color: stage.accent,
      transparent: true,
      opacity: 0.16,
    }))
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.position.copy(position)
    haloGroupLookAtCamera(halo)
    nodeGroup.add(halo)

    const lineGeometry = track(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      position,
    ]))
    const line = track(new THREE.Line(lineGeometry, lineMaterial))
    nodeGroup.add(line)

    nodeMeshes.push({ mesh, halo, stage })
  })
}

const haloGroupLookAtCamera = (halo) => {
  halo.rotation.x = Math.PI / 2
}

const createParticles = () => {
  const particleCount = 130
  const positions = new Float32Array(particleCount * 3)

  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const radius = 0.7 + Math.random() * 2.4
    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = Math.sin(angle) * radius
    positions[index * 3 + 2] = (Math.random() - 0.5) * 1.15
  }

  const geometry = track(new THREE.BufferGeometry())
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = track(new THREE.PointsMaterial({
    color: 0xb9fff0,
    size: 0.026,
    transparent: true,
    opacity: 0.56,
    sizeAttenuation: true,
  }))

  particleField = track(new THREE.Points(geometry, material))
  scene.add(particleField)
}

const animate = () => {
  animationFrame = requestAnimationFrame(animate)

  if (props.isPlaying) {
    nodeGroup.rotation.z += 0.0024
    particleField.rotation.z -= 0.0016
    core.rotation.y += 0.006
  }

  nodeMeshes.forEach(({ halo }, index) => {
    halo.rotation.z += 0.006 + index * 0.001
  })

  renderer.render(scene, camera)
}

const initThree = () => {
  try {
    if (!canvasHost.value) {
      return
    }

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 6.4)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    canvasHost.value.appendChild(renderer.domElement)

    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    const ambientLight = new THREE.AmbientLight(0x9fd7ce, 1.2)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x8bd6c4, 22, 8)
    pointLight.position.set(0, 0, 2.4)
    scene.add(pointLight)

    const coreGeometry = track(new THREE.IcosahedronGeometry(0.62, 4))
    const coreMaterial = track(new THREE.MeshStandardMaterial({
      color: 0x8bd6c4,
      emissive: 0x1f8a70,
      emissiveIntensity: 1.18,
      roughness: 0.18,
      metalness: 0.35,
      transparent: true,
      opacity: 0.92,
    }))
    core = track(new THREE.Mesh(coreGeometry, coreMaterial))
    scene.add(core)

    createParticles()
    createStageNodes()
    updateActiveNode()
    resizeRenderer()

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    resizeObserver = new ResizeObserver(resizeRenderer)
    resizeObserver.observe(canvasHost.value)
    animate()
  } catch (error) {
    console.warn('Build scene WebGL initialization failed.', error)
    disposeScene()
    hasWebGL.value = false
  }
}

watch(() => props.activeStageId, updateActiveNode)

onMounted(async () => {
  await nextTick()
  initThree()
})

onUnmounted(() => {
  disposeScene()
})
</script>

<template>
  <div ref="sceneRoot" class="build-scene">
    <div class="build-scene__canvas-wrap">
      <div v-if="hasWebGL" ref="canvasHost" class="build-scene__canvas" aria-hidden="true"></div>

      <div v-else class="build-scene__fallback" aria-label="构建流程静态图">
        <button
          v-for="(stage, index) in stages"
          :key="stage.id"
          class="build-scene__fallback-node"
          :class="{ 'build-scene__fallback-node--active': stage.id === activeStageId }"
          type="button"
          :style="{ ...fallbackPosition(index), '--stage-accent': stage.accent }"
          @click="$emit('select-stage', stage.id)"
        >
          {{ stage.title }}
        </button>
        <span class="build-scene__fallback-core">TCM</span>
      </div>

      <div class="build-scene__pulse" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="build-scene__keywords" aria-hidden="true">
        <span>脉象</span>
        <span>本草</span>
        <span>证候</span>
        <span>方剂</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.build-scene {
  min-height: 480px;
  border: 1px solid rgba(169, 216, 216, 0.18);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 48%, rgba(139, 214, 196, 0.22), transparent 26%),
    linear-gradient(180deg, rgba(8, 22, 28, 0.32), rgba(8, 22, 28, 0.74));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -40px 80px rgba(3, 10, 14, 0.28);
}

.build-scene__canvas-wrap {
  position: relative;
  overflow: hidden;
  min-height: 480px;
  height: 100%;
  border-radius: 8px;
}

.build-scene__canvas {
  position: absolute;
  inset: 0;
  cursor: pointer;
}

.build-scene__canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.build-scene__pulse {
  position: absolute;
  right: 22px;
  bottom: 22px;
  display: grid;
  width: min(220px, 42%);
  height: 70px;
  align-items: center;
  pointer-events: none;
  opacity: 0.82;
}

.build-scene__pulse span {
  grid-area: 1 / 1;
  height: 2px;
  background:
    linear-gradient(90deg, transparent, #8bd6c4 9%, transparent 18%),
    repeating-linear-gradient(
      90deg,
      transparent 0 18px,
      rgba(139, 214, 196, 0.85) 18px 20px,
      transparent 20px 34px
    );
  filter: drop-shadow(0 0 8px rgba(139, 214, 196, 0.64));
  transform: skewY(-8deg);
}

.build-scene__pulse span:nth-child(2) {
  transform: translateY(-14px) scaleX(0.7) skewY(10deg);
  opacity: 0.46;
}

.build-scene__pulse span:nth-child(3) {
  transform: translateY(16px) scaleX(0.82) skewY(-12deg);
  opacity: 0.34;
}

.build-scene__keywords {
  position: absolute;
  inset: 20px;
  pointer-events: none;
}

.build-scene__keywords span {
  position: absolute;
  padding: 5px 8px;
  border: 1px solid rgba(139, 214, 196, 0.16);
  border-radius: 7px;
  color: rgba(237, 247, 246, 0.62);
  background: rgba(8, 22, 28, 0.48);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
}

.build-scene__keywords span:nth-child(1) {
  left: 10%;
  top: 12%;
}

.build-scene__keywords span:nth-child(2) {
  right: 12%;
  top: 18%;
}

.build-scene__keywords span:nth-child(3) {
  left: 14%;
  bottom: 16%;
}

.build-scene__keywords span:nth-child(4) {
  right: 16%;
  bottom: 24%;
}

.build-scene__fallback {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 49.8%, rgba(139, 214, 196, 0.22) 50%, transparent 50.2%),
    linear-gradient(0deg, transparent 49.8%, rgba(139, 214, 196, 0.22) 50%, transparent 50.2%),
    radial-gradient(circle at center, rgba(139, 214, 196, 0.18), transparent 34%);
}

.build-scene__fallback-core,
.build-scene__fallback-node {
  position: absolute;
  transform: translate(-50%, -50%);
}

.build-scene__fallback-core {
  left: 50%;
  top: 50%;
  display: inline-flex;
  width: 78px;
  height: 78px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(139, 214, 196, 0.48);
  border-radius: 50%;
  color: #ffffff;
  background: rgba(31, 138, 112, 0.38);
  box-shadow: 0 0 44px rgba(139, 214, 196, 0.42);
  font-weight: 800;
}

.build-scene__fallback-node {
  max-width: min(180px, 36%);
  padding: 9px 11px;
  border: 1px solid color-mix(in srgb, var(--stage-accent), transparent 40%);
  border-radius: 8px;
  color: rgba(237, 247, 246, 0.8);
  background: rgba(8, 22, 28, 0.78);
  box-shadow: 0 0 22px color-mix(in srgb, var(--stage-accent), transparent 74%);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
}

.build-scene__fallback-node--active {
  color: #ffffff;
  background: color-mix(in srgb, var(--stage-accent), rgba(8, 22, 28, 0.78) 70%);
}

@media (max-width: 720px) {
  .build-scene,
  .build-scene__canvas-wrap {
    min-height: 380px;
  }

  .build-scene__keywords span:nth-child(2),
  .build-scene__keywords span:nth-child(4) {
    right: 8%;
  }
}

@media (max-width: 430px) {
  .build-scene,
  .build-scene__canvas-wrap {
    min-height: 330px;
  }

  .build-scene__pulse {
    width: 54%;
  }

  .build-scene__keywords {
    inset: 14px;
  }

  .build-scene__keywords span {
    font-size: 11px;
  }
}
</style>
