<script setup>
// IMPORTS //
// -> Dependencies
import { useRoute } from 'vue-router';
// -> Stores
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
// Components
import UploadPhotoModal from './UploadPhotoModal.vue';
// Props //
const props = defineProps(['user', 'userInfo', 'addNewPost'])
// Route data //
const route = useRoute()
const {username: profileUsername} = route.params
// Store data //
const userStore = useUserStore()
const {user} = storeToRefs(userStore)


</script>

<template>
  <div class="userbar-container" v-if="props.user">
    <div class="top-content">
      <a-typography-title :level="2">{{ props.user.username }}</a-typography-title>
      <UploadPhotoModal
        v-if="user && profileUsername === user.username"
        :addNewPost="props.addNewPost"
      />
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