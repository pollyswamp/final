<template>
  <div class="match-list-container">
    <v-col class="page-breadcrumb">
      Лиги > {{ leagueName }}
    </v-col>
    <v-col class="page-title">
      <h1>Матчи</h1>
    </v-col>

    <v-progress-circular v-if="isLoading" class="loader" color="primary" indeterminate />

    <v-expansion-panels class="filter-panel-group">
      <v-expansion-panel class="filter-panel">
        <v-expansion-panel-title v-slot="{ expanded }">
          <v-row no-gutters align="center">
            <v-col class="filter-title" cols="4">
              Фильтрация по дате
            </v-col>
            <v-col class="text--secondary" cols="8">
              <v-fade-transition leave-absolute>
                <span v-if="expanded"></span>
                <v-row v-else no-gutters class="date-summary-row">
                  <v-col class="d-flex justify-start" cols="6">
                    Начальная дата: {{ formattedDateFrom || 'Не выбрана' }}
                  </v-col>
                  <v-col class="d-flex justify-start" cols="6">
                    Конечная дата: {{ formattedDateTo || 'Не выбрана' }}
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-col class="d-flex justify-center py-4">
          <v-btn @click="clearFilter" color="primary" variant="tonal" class="clear-filter-btn">Очистить фильтр</v-btn>
        </v-col>
        <v-expansion-panel-text>
          <v-row justify="space-around" no-gutters>
            <v-col cols="12" sm="5">
              <v-date-picker v-model="dateFrom" title="Начальная дата" header="Укажите дату" color="primary" show-current />
            </v-col>
            <v-col cols="12" sm="5">
              <v-date-picker v-model="dateTo" title="Конечная дата" header="Укажите дату" color="primary" show-current />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-data-table :headers="headers" :items="filteredMatches" class="matches-table">
      <template #item.utcDate="{ item }">
        {{ new Date(item.utcDate).toLocaleString() }}
      </template>

      <template #item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small">
          {{ getStatusText(item.status) }}
        </v-chip>
      </template>

      <template #item.teams="{ item }">
        <b>{{ item.homeTeam?.name }} (H) </b> - {{ item.awayTeam?.name }}
      </template>

      <template #item.score="{ item }">
        <span v-if="item.status === 'FINISHED'">
          {{ item.score?.fullTime.home }} - {{ item.score?.fullTime.away }} ( {{ item.score?.halfTime.home }} -
          {{ item.score?.halfTime.away }} )
        </span>
        <span v-else>-</span>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'

const route = useRoute()
const dateFrom = ref(null)
const dateTo = ref(null)
const leagueName = ref(null)
const matches = ref([])
const isLoading = ref(false)
const headers = [
  { key: 'utcDate', title: 'Дата', sortable: true },
  { key: 'status', title: 'Статус', sortable: false },
  { key: 'teams', title: 'Команды', sortable: false },
  { key: 'score', title: 'Счет', sortable: false },
]

const filteredMatches = computed(() => {
  if (!dateFrom.value || !dateTo.value) return matches.value
  const from = new Date(dateFrom.value).setHours(0, 0, 0, 0)
  const to = new Date(dateTo.value).setHours(23, 59, 59, 999)

  return matches.value.filter(match => {
    const matchDate = new Date(match.utcDate)
    return matchDate.getTime() >= from && matchDate.getTime() <= to
  })
})

const formattedDateTo = computed(() => {
  if (!dateTo.value) return
  return new Date(dateTo.value).toLocaleDateString()
})

const formattedDateFrom = computed(() => {
  if (!dateFrom.value) return
  return new Date(dateFrom.value).toLocaleDateString()
})

const clearFilter = () => {
  dateFrom.value = null
  dateTo.value = null
}

const getStatusText = (status) => {
  const statusMap = {
    FINISHED: 'Матч завершен',
    SCHEDULED: 'Запланирован',
    LIVE: 'В прямом эфире',
    IN_PLAY: 'В игре',
    PAUSED: 'Пауза',
    POSTPONED: 'Отложен',
    SUSPENDED: 'Приостановлен',
    CANCELED: 'Отменен',
    TIMED: 'Рассчитан'
  }
  return statusMap[status] || status
}

const getStatusColor = (status) => {
  const statusMap = {
    FINISHED: 'success',
    SCHEDULED: 'info',
    LIVE: 'error',
    IN_PLAY: 'warning',
    PAUSED: 'primary',
    POSTPONED: 'grey',
    SUSPENDED: 'orange',
    CANCELED: 'red-darken-4',
    TIMED: 'secondary'
  }
  return statusMap[status] || 'default'
}

const loadMatches = async () => {
  isLoading.value = true
  const leagueId = route.query.id
  try {
    const response = await api.get(`api/v4/competitions/${leagueId}/matches`)
    matches.value = response.data.matches
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const loadLeagueName = async () => {
  isLoading.value = true
  const leagueId = route.query.id
  try {
    const response = await api.get(`api/v4/competitions/${leagueId}`)
    leagueName.value = response.data.name
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMatches()
  loadLeagueName()
})
</script>

<style scoped>
.match-list-container {
  padding: 24px;
}

.page-breadcrumb {
  font-size: 0.9em;
  color: var(--v-theme-on-background-variant);
  padding-bottom: 0;
}

.page-title h1 {
  font-size: 2.2em;
  font-weight: 700;
  color: var(--v-theme-on-background);
  margin-top: 8px;
  margin-bottom: 24px;
}

.loader {
  display: block;
  margin: 64px auto;
}

.filter-panel-group {
  margin-bottom: 32px;
}

.filter-panel {
  border-radius: 12px;
  background-color: var(--v-theme-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-title {
  font-weight: 500;
  color: var(--v-theme-on-surface);
}

.date-summary-row {
  width: 100%;
}

.clear-filter-btn {
  margin-top: 8px;
}

.matches-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}
</style>