<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main" aria-label="应用内容">
      <RouterView />
    </main>
  </div>
</template>
