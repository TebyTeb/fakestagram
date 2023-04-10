<script setup>
// IMPORTS
//  -> Dependencies
//  -> Components
import Container from './Container.vue'
import Card from './Card.vue'
// Temp Data
const data = [
  {
    id: 1,
    username: 'Mando',
    url: 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2020/09/mandalorian-temporada-2-2059405.jpg?tf=3840x',
    caption: ''
  },
  {
    id: 2,
    username: 'Ahsoka',
    url: 'https://m.media-amazon.com/images/M/MV5BYzA3ZjQ4YTItNjRhYS00YzRkLTg4NTEtMTYyOGZjNDFmYWM5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    caption: 'May the force be with you'
  }
]
</script>

<template>
  <Container>
    <div class="timeline-container">
      <Card v-for="post in data" :key="post.id" :post="post" />
    </div>
  </Container>
</template>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
</style>
