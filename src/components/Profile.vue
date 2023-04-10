<script setup>
// IMPORTS //
//  -> Dependencies
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'
//  -> Components
import Container from './Container.vue'
import ImageGallery from './ImageGallery.vue'
import UserBar from './UserBar.vue'
// Routes //
const route = useRoute()
const { username } = route.params
// States //
const posts = ref([])
const user = ref(null)
const loading = ref(false)
// Handlers //
const addNewPost = (post) => {
  posts.value.unshift(post)
}
const fetchData = async () => {
  loading.value = true
  const { data: userData } = await supabase.from('users').select().eq('username', username).single()
  if (!userData) {
    loading.value = false
    return (user.value = null)
  }
  user.value = userData

  const { data: postsData } = await supabase.from('posts').select().eq('owner_id', user.value.id)
  posts.value = postsData
  loading.value = false
}
// Directive Hooks //
onMounted(() => {
  fetchData()
})
</script>

<template>
  <Container>
    <div class="profile-container" v-if="!loading">
      <UserBar
        :key="$route.params.username"
        :user="user"
        :userInfo="{
          posts: 4,
          followers: 100,
          following: 300
        }"
        :addNewPost="addNewPost"
      />
      <ImageGallery :posts="posts" />
    </div>
    <div v-else class="spinner">
      <a-spin />
    </div>
  </Container>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
}
</style>
