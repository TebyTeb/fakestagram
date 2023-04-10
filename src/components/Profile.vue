<script setup>
// IMPORTS //
//  -> Dependencies
import { onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'
//  -> Components
import Container from './Container.vue'
import ImageGallery from './ImageGallery.vue'
import UserBar from './UserBar.vue'
//  -> Stores
const userStore = useUserStore()
// Routes //
const route = useRoute()
const { username } = route.params
// States //
const { user: loggedInUser } = storeToRefs(userStore)
const posts = ref([])
const user = ref(null)
const loading = ref(false)
const isFollowing = ref(false)
const userInfo = reactive({
  posts: null,
  followers: null,
  following: null
})
// Reactive updaters //

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

  await fetchIsFollowing()

  const followerCount = await fetchFollowersCount()
  const followingCount = await fetchFollowingCount()
  userInfo.followers = followerCount
  userInfo.following = followingCount
  userInfo.posts = posts.value.length

  loading.value = false
}
// Auxiliary fetch //
const fetchFollowersCount = async () => {
  const { count } = await supabase
    .from('followers_following')
    .select('*', { count: 'exact' })
    .eq('following_id', user.value.id)
  return count
}
const fetchFollowingCount = async () => {
  const { count } = await supabase
    .from('followers_following')
    .select('*', { count: 'exact' })
    .eq('follower_id', user.value.id)
  return count
}
const fetchIsFollowing = async () => {
  if (loggedInUser.value && loggedInUser.value.id !== user.value.id) {
    const { data } = await supabase
      .from('followers_following')
      .select()
      .eq('follower_id', loggedInUser.value.id)
      .eq('following_id', user.value.id)
      .single()
    if (data) isFollowing.value = true
  }
}
// Helper functions //
const updateIsFollowing = (follow) => {
  isFollowing.value = follow
}
// Watchers //
watch(loggedInUser, () => {
  fetchIsFollowing()
})
// Directive Hooks //
onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <Container>
    <div class="profile-container" v-if="!loading">
      <UserBar
        :key="$route.params.username"
        :user="user"
        :userInfo="userInfo"
        :addNewPost="addNewPost"
        :isFollowing="isFollowing"
        :updateIsFollowing="updateIsFollowing"
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
