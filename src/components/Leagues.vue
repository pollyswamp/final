<template>
  <div class="main-content-area">
    <v-combobox
      v-model="searchQuery"
      class="search-input"
      label="Введите или выберите лигу"
      variant="outlined"
      color="success"
      :items="leagues.map(l => l.name)"
      prepend-inner-icon="mdi-soccer"
      @input="onSearchInput"
    />

    <v-progress-circular v-if="isLoading" class="loader" color="primary" indeterminate />

    <v-alert v-else-if="filteredLeagues.length === 0" class="empty-message" type="info">
      {{ searchQuery ? 'Ничего не найдено' : 'Нет доступных лиг' }}
    </v-alert>

    <template v-else>
      <v-row class="content-grid">
        <v-col v-for="league in paginatedLeagues" :key="league.id" cols="12" lg="3" md="4" sm="6">
          <Card :id="league.id" :emblem="league.emblem" :league="league.area.name" :name="league.name"
            @handle-card-click="goToLeague" />
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
const itemsPerPage = 4 
const leagues = ref([])
const searchQuery = ref('')
const isLoading = ref(false)

const totalPages = computed(() => {
  return Math.ceil(filteredLeagues.value.length / itemsPerPage)
})

const paginatedLeagues = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLeagues.value.slice(start, end)
})

const filteredLeagues = computed(() => {
  if (!searchQuery.value) return leagues.value
  const query = searchQuery.value.toLowerCase()
  return leagues.value.filter(league => league.name.toLowerCase().includes(query))
})

const onSearchInput = () => {
  page.value = 1
}

const loadLeagues = async () => {
  isLoading.value = true
  try {
    const response = await api.get('api/v4/competitions')
    leagues.value = response.data.competitions
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goToLeague = (payload) => {
  router.push(`/league/?id=${payload.id}`)
}

onMounted(() => {
  loadLeagues()
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