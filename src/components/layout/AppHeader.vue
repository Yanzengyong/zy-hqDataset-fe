<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = computed(() => [
  {
    label: '首页',
    to: '/',
    isActive: route.path === '/',
  },
  {
    label: '数据集构建',
    to: '/build',
    isActive: route.path.startsWith('/build'),
  },
  {
    label: '数据集超市',
    to: '/market',
    isActive: route.path.startsWith('/market'),
  },
])
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink class="app-header__brand" to="/">
        中医药高质量数据集构建演示系统
      </RouterLink>

      <nav class="app-header__nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :class="{ 'is-active': item.isActive }"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <span class="app-header__status">中医药数据资产演示</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
}

.app-header__inner {
  display: flex;
  width: min(var(--layout-width), calc(100% - 32px));
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 auto;
  padding: 12px 0;
}

.app-header__brand {
  flex: 1 1 280px;
  min-width: 220px;
  color: var(--color-ink);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0;
}

.app-header__nav {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-panel-subtle);
}

.app-header__nav a {
  white-space: nowrap;
  padding: 7px 12px;
  border-radius: 6px;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.4;
}

.app-header__nav a:hover,
.app-header__nav a.is-active {
  color: var(--color-blue-deep);
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(39, 92, 160, 0.08);
}

.app-header__status {
  flex: 0 0 auto;
  white-space: nowrap;
  padding: 5px 9px;
  border: 1px solid rgba(18, 127, 132, 0.22);
  border-radius: 6px;
  color: var(--color-teal);
  background: rgba(18, 127, 132, 0.08);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

@media (max-width: 840px) {
  .app-header__inner {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  .app-header__brand {
    min-width: 0;
  }

  .app-header__nav {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .app-header__status {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .app-header__inner {
    width: min(var(--layout-width), calc(100% - 24px));
  }

  .app-header__nav a {
    flex: 1 1 auto;
    text-align: center;
  }
}
</style>
