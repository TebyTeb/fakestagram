<script setup>
defineProps(['posts'])
// Static Data //
const baseUrl = 'https://pmjhucdxqbeywyvbqpdj.supabase.co/storage/v1/object/public/images/'
</script>

<template>
  <div class="gallery-container">
    <img 
      v-for="post in posts" 
      :key="post.id" 
      :src="`${baseUrl}${post.url}`" 
    />
  </div>
</template>

<style scoped>
.gallery-container {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}
img {
  margin: 5px;
  width: 200px;
}
</style>
