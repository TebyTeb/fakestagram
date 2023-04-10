<script setup>
// IMPORTS //
// -> Dependencies
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
// -> Helpers
import { generateRandomId } from '@/helpers/index'
/* import { CloudUploadOutlined } from '@ant-design/icons-vue'; */
// -> Stores
import { useUserStore } from '@/stores/userStore'
// Props //
const props = defineProps(['addNewPost'])
// Stores //
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
// States //
const loadingImg = ref(false)
const errorMessage = ref('')
const visible = ref(false)
const caption = ref('')
const file = ref(null)
// Helper Functions //
const showModal = () => {
  visible.value = true
}
// Handlers //
const handleCancel = () => {}
const handleOk = async () => {
  loadingImg.value = true
  if (!file.value) {
    loadingImg.value = false
    return (errorMessage.value = 'Select an image to upload')
  } else if (file.value) {
    const fileName = generateRandomId()
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${fileName}`, file.value)
    if (error) {
      loadingImg.value = false
      return (errorMessage.value = error.message)
    }
    await supabase.from('posts').insert({
      url: data.path,
      caption: caption.value,
      owner_id: user.value.id
    })
    props.addNewPost({
    url: data.path,
    caption: caption.value,
  })
  }
  loadingImg.value = false
  visible.value = false
  caption.value = ''
  file.value = null
}
const handleUploadChange = (e) => {
  if (e.target.files[0]) {
    file.value = e.target.files[0]
  }
}
</script>

<template>
  <div>
    <a-button @click="showModal">Upload Photo</a-button>
    <a-modal v-model:visible="visible" title="Upload a photo" @cancel="handleCancel" @ok="handleOk">
      <div v-if="!loadingImg" class="input-container">
        <input id="file-upload" type="file" accept=".jpeg, .png" @change="handleUploadChange" />
        <a-input v-model:value="caption" placeholder="Caption..." :maxLength="50" />
        <a-typography-text v-if="errorMessage" type="danger">{{ errorMessage }}</a-typography-text>
      </div>
      <div v-else class="spinner">
        <a-spin />
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
input {
  margin-top: 10px;
}
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}
/* input[type="file"] {
  display: none;
} */
/* .custom-file-upload {
  text-align: center;
    border: 1px solid #ccc;
    display: block;
    padding: 6px 12px;
    cursor: pointer;
} */
</style>
