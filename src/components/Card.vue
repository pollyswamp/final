<template>
  <v-card
    class="card-custom"
    flat
    @click="$emit('handle-card-click', { id })"
  >
    <v-img class="card-img" contain height="100" :src="emblem" />
    <v-card-title class="card-title">{{ name }}</v-card-title>
    <v-card-subtitle class="card-subtitle">{{ league }}</v-card-subtitle>
  </v-card>
</template>

<script setup>
defineProps({
  id: {
    type: Number,
    required: true,
  },
  emblem: {
    type: String,
    default: '/src/assets/placeholder.svg',
  },
  name: {
    type: String,
    required: true,
  },
  league: {
    type: String,
    default: 'Не указано',
  },
})

defineEmits(['handle-card-click'])
</script>

<style scoped>
.card-custom {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 16px;
  border-radius: 12px;
  background-color: var(--v-theme-surface);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.card-custom:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-img {
  background-color: var(--v-theme-background);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 10px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  padding: 16px 16px 8px;
  line-height: 1.3;
  color: var(--v-theme-on-surface);
}

.card-subtitle {
  padding: 0 16px 16px;
  font-size: 0.95rem;
  color: var(--v-theme-on-surface-variant);
}
</style>