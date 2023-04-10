<script setup>
// IMPORTS //
// -> Dependencies
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
// -> Components
import Container from './Container.vue'
import AuthModal from './AuthModal.vue'
// Router //
const router = useRouter()
// Stores //
const userStore = useUserStore()
// States //
const searchUsername = ref('')
const { user, loadingUser } = storeToRefs(userStore)
// Handlers //
const onSearch = () => {
  if (searchUsername.value) {
    router.push(`/profile/${searchUsername.value}`)
    searchUsername.value = ''
  }
}
const goToProfile = () => {
  router.push(`/profile/${user.value.username}`)
}
</script>

<template>
  <a-layout-header>
    <Container>
      <div class="nav-container">
        <div class="right-content">
          <RouterLink to="/">FakeStagram</RouterLink>
          <a-input-search
            v-model:value="searchUsername"
            placeholder="Username..."
            style="width: 200px"
            @search="onSearch"
          />
        </div>
        <div v-if="!loadingUser" class="left-content">
          <div v-if="!user">
            <AuthModal :isLogin="true" />
            <AuthModal :isLogin="false" />
          </div>
          <div v-else>
            <a-button type="primary" @click="goToProfile">Profile</a-button>
            <a-button type="primary" @click="userStore.handleLogout()">Logout</a-button>
          </div>
        </div>
      </div>
    </Container>
  </a-layout-header>
</template>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
}
.right-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.left-content {
  display: flex;
  align-items: center;
}
.left-content>div {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
