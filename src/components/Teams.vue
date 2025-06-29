<template>
<div class="main-content-area">
    <v-combobox
      v-model="searchQuery"
      class="search-input"
      label="Введите или выберите команду"
      variant="outlined"
      color="success"
      :items="teams.map(l => l.name)"
      prepend-inner-icon="mdi-soccer"
      density="compact"
      hide-details
      @update:modelValue="onSearchInput"
    />

    <v-progress-circular v-if="isLoading" class="loader" color="primary" indeterminate />

    <v-alert v-else-if="filteredTeams.length === 0" class="empty-message" type="info">
      {{ searchQuery ? 'Ничего не найдено' : 'Нет доступных команд' }}
    </v-alert>

    <template v-else>
      <v-row class="content-grid">
        <v-col v-for="team in paginatedTeams" :key="team.id" cols="12" lg="3" md="4" sm="6">
          <Card :id="team.id" :emblem="team.crest" :name="team.name" :league="team.website"
            @handle-card-click="goToTeam" />
        </v-col>
      </v-row>

      <v-pagination v-model="page" class="pagination-custom mt-8" :length="totalPages" :total-visible="7" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import Card from '@/components/Card.vue'

const router = useRouter()
const page = ref(1)
const itemsPerPage = 50 
const teams = ref([])
const searchQuery = ref('')
const isLoading = ref(false)

const totalPages = computed(() => {
  return Math.ceil(filteredTeams.value.length / itemsPerPage)
})

const paginatedTeams = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTeams.value.slice(start, end)
})

const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams.value
  const query = searchQuery.value.toLowerCase()
  return teams.value.filter(team => team.name.toLowerCase().includes(query))
})

const onSearchInput = () => {
  page.value = 1
}

const loadTeams = async () => {
  isLoading.value = true
  try {
    const response = await api.get('api/v4/teams')
    teams.value = response.data.teams
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goToTeam = (payload) => {
  router.push(`/team/?id=${payload.id}`)
}

onMounted(() => {
  loadTeams()
})
</script>

<style scoped>
.main-content-area {
  padding: 24px;
}

.search-input {
  max-width: 500px;
  margin: 0 auto 32px auto;
  border-radius: 8px;
  overflow: hidden;
}

.loader {
  display: block;
  margin: 64px auto;
}

.empty-message {
  margin: 32px auto;
  max-width: 600px;
  border-radius: 8px;
  background-color: var(--v-theme-secondary);
  color: var(--v-theme-on-secondary);
}

.content-grid {
  justify-content: center;
}

.pagination-custom {
  justify-content: center;
}
</style>