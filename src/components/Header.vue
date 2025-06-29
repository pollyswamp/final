<template>
  <v-app-bar app class="app-bar-custom" height="100">
    <v-row align="center" justify="start">
      <v-img :src="logoSrc" max-height="80" max-width="120" contain class="app-logo"></v-img>
      <v-btn class="nav-button" variant="flat" color="primary" @click="router.push(`/`)">
        Лиги
      </v-btn>
      <v-btn class="nav-button" variant="flat" color="primary" @click="router.push(`/teams`)">
        Команды
      </v-btn>
    </v-row>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logoSrc = ref('/src/assets/soccer_ball.jpg')
</script>

<style scoped>
.app-bar-custom {
  background-color: var(--v-theme-secondary) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 0 16px;
}

.app-logo {
  margin-right: 24px;
  min-width: 80px;
}

.nav-button {
  min-width: 150px;
  height: 60px !important;
  margin: 0 8px;
  font-size: 1.1em;
  font-weight: 500;
  border-radius: 8px;
  text-transform: none;
}
</style>