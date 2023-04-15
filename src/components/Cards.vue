<script setup>
// IMPORTS //
// -> Dependencies
import { onMounted, ref } from 'vue'
import { supabase } from '@/supabase'
import { storeToRefs } from 'pinia'
// -> Components
import Observer from './Observer.vue'
import Card from './Card.vue'
// -> Stores
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
// -> States
const posts = ref([])
const ownerIds = ref([])
const lastPostIndex = ref(3)
const reachEnd = ref(false)
// Handlers //
const fetchData = async () => {
  const { data: followings } = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', user.value.id)

  ownerIds.value = followings.map((f) => f.following_id)

  const { data: FetchedPosts } = await supabase
    .from('posts')
    .select()
    .in('owner_id', ownerIds.value)
    .range(0, lastPostIndex.value)
    .order('created_at', { ascending: false })

  posts.value = FetchedPosts
}

const fetchNextSet = async () => {
  if (!reachEnd.value) {
    const { data: FetchedPosts } = await supabase
      .from('posts')
      .select()
      .in('owner_id', ownerIds.value)
      .range(lastPostIndex.value + 1, lastPostIndex.value + 4)
      .order('created_at', { ascending: false })

    posts.value = [...posts.value, ...FetchedPosts]
    lastPostIndex.value = lastPostIndex.value + 4
    if (!FetchedPosts.length) {
      reachEnd.value = true
    }
  }
}

// Directive Hooks //
onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="timeline-container">
    <Card v-for="post in posts" :key="post.id" :post="post" />
    <Observer v-if="posts.length" @intersect="fetchNextSet" />
  </div>
</template>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
</style>
