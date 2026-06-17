<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = computed(() => [
  {
    label: '首页',
    to: '/',
  },
  {
    label: '数据集构建',
    to: '/build',
  },
  {
    label: '数据集超市',
    to: '/market',
  },
])

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink class="app-header__brand" to="/">
        <span class="app-header__brand-mark" aria-hidden="true">
          <span class="app-header__brand-dot app-header__brand-dot--blue"></span>
          <span class="app-header__brand-dot app-header__brand-dot--teal"></span>
        </span>
        <span class="app-header__brand-text">中医药（苗药）高质量数据集构建平台</span>
      </RouterLink>

      <nav class="app-header__nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          class="app-header__nav-link"
          :class="{ 'is-active': isActive(item.to) }"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="app-header__actions">
        <!-- <span class="app-header__status">
          <span class="app-header__status-dot"></span>
          演示环境
        </span> -->
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  box-shadow: 0 1px 0 rgba(24, 36, 51, 0.02), 0 2px 12px rgba(24, 36, 51, 0.04);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 99%;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  gap: 32px;
}

/* ── Brand ── */
.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--color-ink);
  text-decoration: none;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.app-header__brand-mark {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--color-blue), var(--color-blue-deep));
  box-shadow: 0 4px 12px rgba(39, 92, 160, 0.32);
  flex-shrink: 0;
}

.app-header__brand-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
}

.app-header__brand-dot--blue {
  top: 9px;
  left: 9px;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
}

.app-header__brand-dot--teal {
  bottom: 9px;
  right: 9px;
  width: 10px;
  height: 10px;
  background: #5eead4;
}

.app-header__brand-text {
  white-space: nowrap;
}

/* ── Nav ── */
.app-header__nav {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  margin-left: 100px;
  gap: 8px;
  flex: 1;
}

.app-header__nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 42px;
  padding: 0 24px;
  border-radius: 9px;
  color: var(--color-muted);
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  transition: color 180ms ease, background 180ms ease;
}

.app-header__nav-link:hover {
  color: var(--color-ink);
  background: var(--color-panel-subtle);
}

.app-header__nav-link.is-active {
  color: var(--color-blue-deep);
  background: rgba(39, 92, 160, 0.08);
  font-weight: 600;
}

/* ── Actions ── */
.app-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.app-header__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(18, 127, 132, 0.2);
  border-radius: 8px;
  color: var(--color-teal);
  background: rgba(232, 248, 248, 0.6);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
}

.app-header__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-teal);
  box-shadow: 0 0 7px rgba(18, 127, 132, 0.6);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

/* ── Responsive ── */
@media (max-width: 840px) {
  .app-header__inner {
    padding: 0 16px;
    gap: 16px;
  }

  .app-header__brand-text {
    display: none;
  }

  .app-header__nav-link {
    padding: 0 14px;
    font-size: 14px;
  }
}

@media (max-width: 560px) {
  .app-header__nav-link {
    padding: 0 10px;
    font-size: 13px;
  }

  .app-header__status {
    display: none;
  }
}
</style>
