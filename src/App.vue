<script setup>
// IMPORTS
// -> Dependencies
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import {useUserStore} from '@/stores/userStore'
// -> Components
import Nav from '@/components/Nav.vue'
// Stores //
const userStore = useUserStore()
// Mounted Hooks //
onMounted(() => {
  userStore.getUser()
})
</script>

<template>
  <nav>
    <Nav />
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
