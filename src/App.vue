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
