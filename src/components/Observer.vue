<script setup>
// IMPORTS //
// ->Dependencies
import { ref, onMounted, defineEmits } from 'vue'
// States //
const observer = ref(null)
const root = ref(null)
// Emits //
const emits = defineEmits(['intersect'])

// Directive Hooks //
onMounted(async () => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emits('intersect')
    }
  })

  observer.value.observe(root.value)
})
</script>

<template>
  <div class="observer" ref="root"></div>
</template>

<style scoped>
.observer {
  width: 10px;
}
</style>
