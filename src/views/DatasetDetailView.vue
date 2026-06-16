<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="page">
    <h1>数据集详情</h1>
    <p>当前数据集编号：{{ route.params.id }}</p>
  </section>
</template>
