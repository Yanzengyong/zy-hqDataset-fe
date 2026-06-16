<template>
  <header class="app-header">
    <RouterLink class="brand" to="/">中医药数据集演示</RouterLink>
    <nav class="nav-links" aria-label="主导航">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/build">数据集构建</RouterLink>
      <RouterLink to="/market">数据集超市</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px max(16px, calc((100vw - 1120px) / 2));
  border-bottom: 1px solid #dfe7dc;
  background: #ffffff;
}

.brand {
  color: #17351f;
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-links a {
  padding: 8px 12px;
  border-radius: 6px;
  color: #52615a;
}

.nav-links a.router-link-active {
  color: #17351f;
  background: #e8f3e5;
}

@media (max-width: 640px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}
</style>
