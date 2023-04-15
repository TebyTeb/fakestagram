<script setup>
// Props //
defineProps(['post'])

// Static Data //
const baseUrl = import.meta.env.VITE_IMG_URL
</script>

<template>
  <a-card class="card" hoverable style="width: 240px">
    <template #cover>
      <img alt="example" :src="`${baseUrl}${post.url}`" />
    </template>
    <a-card-meta :title="post.username">
      <template #description>{{ post.caption }}</template>
    </a-card-meta>
  </a-card>
</template>

<style scoped>
.card {
  margin-bottom: 10px;
}
</style>