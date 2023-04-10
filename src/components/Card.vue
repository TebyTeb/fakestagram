<script setup>
defineProps(['post'])
</script>

<template>
  <a-card class="card" hoverable style="width: 240px">
    <template #cover>
      <img alt="example" :src="post.url" />
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