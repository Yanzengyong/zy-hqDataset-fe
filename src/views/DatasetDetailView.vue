<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="placeholder-page">
    <h1 class="placeholder-page__title">数据集详情</h1>
    <p class="placeholder-page__description">
      当前数据集编号：{{ route.params.id }}
    </p>
  </section>
</template>
