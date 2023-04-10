<script setup>
// IMPORTS //
// -> Dependencies
import { ref, reactive, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
// Props //
const props = defineProps(['isLogin'])
// Stores //
const userStore = useUserStore()
// Static values //
const title = props.isLogin ? 'Login' : 'Signup'
const initialState = {
  username: '',
  email: '',
  password: ''
}
// States //
const { errorMessage, loading, user } = storeToRefs(userStore)
const userCredentials = reactive({ ...initialState })
const visible = ref(false)
// Helper Functions //
const showModal = () => {
  visible.value = true
}
const resetInputForm = () => {
  // 👈 Helper function que reinicia el form y limpia los mensajes de error
  Object.assign(userCredentials, initialState)
  userStore.clearErrorMessage()
}
// Handlers //
const handleOk = async () => {
  if (props.isLogin) {
    await userStore.handleLogin({
      email: userCredentials.email,
      password: userCredentials.password
    })
    if (user.value) {
      resetInputForm()
      visible.value = false
    }
  } else {
    await userStore.handleSignup(userCredentials)
    if (user.value) {
      resetInputForm()
      visible.value = false
    }
  }
}
const handleCancel = () => {
  resetInputForm()
  visible.value = false
}
</script>

<template>
  <div>
    <a-button type="primary" @click="showModal">{{ title }}</a-button>
    <a-modal v-model:visible="visible" :title="title">
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <div v-if="!loading" class="input-container">
        <a-input
          class="input"
          v-if="!isLogin"
          v-model:value="userCredentials.username"
          placeholder="Username"
        />
        <a-input class="input" v-model:value="userCredentials.email" placeholder="Email" />
        <a-input-password
          class="input"
          v-model:value="userCredentials.password"
          type="password"
          visibilityToggle
          placeholder="Password"
        />
      </div>
      <div v-else class="spinner">
        <a-spin />
      </div>
      <a-typography-text v-if="errorMessage" type="danger">{{ errorMessage }}</a-typography-text>
    </a-modal>
  </div>
</template>

<style scoped>
.input-container {
  height: 120px;
}
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
.input {
  margin-top: 5px;
}
</style>
