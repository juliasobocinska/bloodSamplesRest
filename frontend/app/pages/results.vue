<script setup>
import { ref, computed, onMounted } from 'vue'

//zmienne globalne skryptu
const userIdCookie = useCookie('userId')
const savedUserId = computed(() => userIdCookie.value)

const results = ref([])
const errorMessage = ref('')

const fetchResults = async () => {
  errorMessage.value = ''

  if (!savedUserId.value) {
    errorMessage.value = 'Nie jesteś zalogowany. Zaloguj się na stronie głównej.'
    return
  }

  try {
    const response = await $fetch(`http://localhost:3000/results?userId=${savedUserId.value}`, {
      method: 'GET'
    })

    if (response && response.status === 200) {
      results.value = response.payload
    }

  } catch (error) {
    console.error("Błą ładowania wyników:", error)
    errorMessage.value = "Nie udało się pobrać wyników badań."
  }
}
const logout = () => {
    userIdCookie.value = null
    return navigateTo('/')
}


onMounted(async () => {
  if (savedUserId.value) {
    await fetchResults()
  }
})
</script>

<template>
  <div class="page-container">
    <header class="navbar">
    <nav>
        <NuxtLink to="/" class="nav-item">Strona Główna</NuxtLink> |
        <NuxtLink to="/order" class="nav-item">Złóż zamówienie</NuxtLink> |
        <NuxtLink to="/history" class="nav-item">Historia zamówień</NuxtLink> |
        <NuxtLink to="/results" class="nav-item" active>Moje wyniki</NuxtLink> |
        <span class="nav-item" @click="logout">Wyloguj</span>
      </nav>
    </header>
    <main class="main-content">
    <h1>Moje Wyniki Badań Laboratoryjnych</h1>
      <p v-if="results.length === 0 && !errorMessage" class="no-results">Brak dostępnych wyników badań w systemie.</p>
      <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>
    <table v-if="results.length > 0" class="history-table">
      <thead>
        <tr>
          <th>Nazwa badania</th>
          <th>Wynik</th>
          <th>Norma</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results" :key="result.id">
          <td>{{ result.test_name }}</td>
          <td>{{ result.test_result }}</td>
          <td>{{ result.norm_range }}</td>
          <td>{{ result.status }}</td>
        </tr>
      </tbody>
    </table>
    </main>
  </div>
</template>


<style scoped>

.page-container {
  min-height: 100vh;
  background-color: #f2f0ea;
  padding: 24px;
  font-family: 'Garamond', 'Georgia', system-ui, sans-serif; 
  box-sizing: border-box;
}

.navbar {
  max-width: 896px;
  margin: 0 auto 24px auto;
  background-color: #f2f0ea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #f1f5f9;
}

.navbar nav {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #dfdad0; 
}

.nav-item {
  font-family: sans-serif; 
  color: #5c5146; 
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  margin: 0 16px;
}

.nav-item:hover {
  color: #8b5a2b; 
}

.nav-item.active {
  color: #2e1f15;
  font-weight: bold;
  border-bottom: 3px solid #8b5a2b;
  padding-bottom: 4px;
}

.logout-btn {
  margin-left: auto; 
  cursor: pointer;
  color: #a1978f;
}

.logout-btn:hover {
  color: #8c3a2b;
}

.main-content {
  max-width: 896px;
  margin: 0 auto;
  background-color: #faf9f5; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 32px;
  border: 2px solid #dfdad0;
}

.main-content h1 {
  font-size: 26px;
  color: #2e1f15; 
  margin-top: 0;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
  border-bottom: 2px solid #e8e1d5;
  padding-bottom: 12px;
}

.no-results {
  text-align: center;
  padding: 48px;
  color: #70655b;
  font-weight: 500;
  background-color: #2e1f151f; 
  border-radius: 12px;
  border: 2px dashed #4a3525; 
  margin: 0;
}

.message-error {
  background-color: #f7ebe8;
  border-left: 5px solid #8c3a2b; 
  color: #8c3a2b;
  padding: 16px;
  border-radius: 0 8px 8px 0;
  font-weight: bold;
  margin: 0 0 24px 0;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.history-table th {
  color: #2e1f15;
  background-color: #e8e1d5; 
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
  padding: 12px 10px;
  border-bottom: 3px solid #4a3525; 
}

.history-table td {
  padding: 16px 10px;
  border-bottom: 1px solid #e3ded5;
}

.history-table tbody tr:hover {
  background-color: #f1f3ed;
}

.status-norma {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px; 
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #edf2ee;
  color: #3b5240;
  border: 2px solid #3b5240;
  letter-spacing: 0.05em;
}

.status-alarm {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #f7ebe8;
  color: #8c3a2b;
  border: 2px solid #8c3a2b;
  letter-spacing: 0.05em;
}
</style>