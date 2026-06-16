<script setup>
// Final homepage will be implemented later from the user's specific requirements.
</script>

<template>
  <section class="placeholder-page">
    <div class="placeholder-page__content">
      <p class="placeholder-page__eyebrow">演示系统</p>
      <h1 class="placeholder-page__title">中医药高质量数据集构建演示系统</h1>
      <p class="placeholder-page__description">
        当前提供构建流程演示与数据集超市入口。
      </p>
    </div>

    <nav class="placeholder-page__links" aria-label="页面入口">
      <RouterLink class="placeholder-page__link placeholder-page__link--primary" to="/build">
        数据集构建
      </RouterLink>
      <RouterLink class="placeholder-page__link" to="/market">
        数据集超市
      </RouterLink>
    </nav>
  </section>
</template>
