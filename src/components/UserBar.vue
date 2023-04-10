<script setup>
// IMPORTS //
// -> Dependencies
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase';
// -> Stores
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
// Components
import UploadPhotoModal from './UploadPhotoModal.vue'
// Props //
const props = defineProps(['user', 'userInfo', 'addNewPost', 'isFollowing', 'updateIsFollowing'])
// Route data //
const route = useRoute()
const { username: profileUsername } = route.params
// Store data //
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const followUser = async () => {
  props.updateIsFollowing(true)
  await supabase.from('followers_following').insert({  // Not await bc we not need backend response
    follower_id: user.value.id,
    following_id: props.user.id
  })
}

const unfollowUser = async () => {
  props.updateIsFollowing(false)
  await supabase.from('followers_following')   // Not await bc we not need backend response
    .delete()
    .eq('follower_id', user.value.id)
    .eq('following_id', props.user.id)
}
</script>

<template>
  <div class="userbar-container" v-if="props.user">
    <div class="top-content">
      <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
      <div v-if="user">
        <UploadPhotoModal
          v-if="profileUsername === user.username"
          :addNewPost="props.addNewPost"
        />
        <div v-if="user.username !== profileUsername">
          <a-button v-if="props.isFollowing" @click="unfollowUser">Following</a-button>
          <a-button v-else @click="followUser">Follow</a-button>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <a-typography-title :level="5">{{ userInfo.posts }} posts</a-typography-title>
      <a-typography-title :level="5">{{ userInfo.followers }} followers</a-typography-title>
      <a-typography-title :level="5">{{ userInfo.following }} following</a-typography-title>
    </div>
  </div>
  <div class="userbar-container" v-else>
    <div class="top-content">
      <a-typography-title :level="2">User Not Found</a-typography-title>
    </div>
  </div>
</template>

<style scoped>
.userbar-container {
  padding-bottom: 75px;
}
.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom-content {
  display: flex;
  align-items: center;
}
.bottom-content h5 {
  margin: 0;
  padding: 0;
  margin-right: 30px;
}
</style>
