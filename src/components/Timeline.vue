<script setup>
// IMPORTS
//  -> Dependencies
import { storeToRefs } from 'pinia'
//  -> Components
import Container from './Container.vue'
import LogInMessage from './LogInMessage.vue'
import Cards from './Cards.vue'
// -> Stores
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const { user, loadingUser } = storeToRefs(userStore)
</script>

<template>
  <Container>
    <div v-if="!loadingUser">
      <Cards v-if="user" />
      <LogInMessage v-else />
    </div>
    <div v-else class="spinner">
      <a-spin />
    </div>
  </Container>
</template>

<style scoped>
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
}
</style>
