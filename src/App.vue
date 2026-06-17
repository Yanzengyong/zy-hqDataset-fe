<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const mainClass = computed(() => ({
  'app-main--build': route.path.startsWith('/build'),
}))
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main" :class="mainClass" aria-label="应用内容">
      <RouterView />
    </main>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  overflow: hidden;
}

.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  margin-top: 80px; /* fixed header height */
  box-sizing: border-box;
  background-image: linear-gradient(90deg, rgba(0, 0, 0, .03) 1px, transparent 0), linear-gradient(180deg, rgba(0, 0, 0, .03) 1px, transparent 0);
}
</style>
