<script setup>
import { ref, onMounted } from 'vue'

const results = ref([])
const errorMessage = ref('')
const isLoading = ref(true)

const fetchResults = async () => {
  errorMessage.value = ''
  isLoading.value = true

  const token = useCookie('auth_token').value

  if (!token) {
    errorMessage.value = 'Twoja sesja wygasła lub nie jesteś zalogowany. Zaloguj się ponownie.'
    isLoading.value = false
    return
  }

  try {
    const response = await $fetch(`http://localhost:3000/results`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response && response.payload) {
      results.value = response.payload
    } else {
      results.value = [] 
    }

  } catch (error) {
    console.error("Błąd ładowania wyników:", error)
    if (error.response && error.response.status === 401) {
      errorMessage.value = "Sesja wygasła. Zaloguj się ponownie."
    } else {
      errorMessage.value = "Nie udało się pobrać wyników badań."
    }
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  const tokenCookie = useCookie('auth_token')
  const userCookie = useCookie('user_info')

  tokenCookie.value = null
  userCookie.value = null
  return navigateTo('/login')
}

onMounted(async () => {
  await fetchResults()
})
</script>

<template>
  <div class="page-container">
    <MainNav />
    
    <main class="main-content">
      <h1>Moje Wyniki Badań Laboratoryjnych</h1>
      
      <div v-if="isLoading" class="loading-state">
        <p>Pobieranie danych z laboratorium...</p>
      </div>

      <div v-else>
        <div v-if="results.length === 0 && !errorMessage" class="no-results-box">
          <p class="main-info">Na razie brak dostępnych wyników badań w systemie.</p>
          <p class="sub-info">
            Twoje próbki nie zostały jeszcze zarejestrowane przez laboratorium lub są w trakcie analizy. 
            Wyniki zazwyczaj pojawiają się w systemie w ciągu 2-3 dni roboczych.
          </p>
        </div>

        <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>

        <table v-if="results.length > 0" class="history-table">
          <thead>
            <tr>
              <th>Nazwa badania</th>
              <th>Wynik</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" :key="result.id">
              <td class="test-name">{{ result.test_name }}</td>
              <td class="test-value">{{ result.test_value || result.value }}</td> 
              <td>
                <span :class="result.description === 'W normie' ? 'status-norma' : 'status-alarm'">
                  {{ result.description || 'Brak danych' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  cursor: pointer;
  color: #5c5146;
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

.no-results-box {
  text-align: center;
  padding: 40px 20px;
  background-color: #2e1f150a; 
  border-radius: 12px;
  border: 2px dashed #8b5a2b55; 
  color: #2e1f15;
}

.main-info {
  font-size: 17px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.sub-info {
  font-size: 13.5px;
  line-height: 1.6;
  color: #70655b;
  max-width: 480px;
  margin: 0 auto;
  font-family: sans-serif;
}

.loading-state {
  text-align: center;
  padding: 40px;
  font-size: 15px;
  color: #70655b;
  font-family: sans-serif;
}

.message-error {
  background-color: #f7ebe8;
  border-left: 5px solid #8c3a2b; 
  color: #8c3a2b;
  padding: 16px;
  border-radius: 0 8px 8px 0;
  font-weight: bold;
  margin: 0 0 24px 0;
  font-family: sans-serif;
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

.test-name {
  font-weight: bold;
  color: #2e1f15;
}

.test-value {
  font-family: monospace;
  font-size: 15px;
  font-weight: bold;
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
  font-family: sans-serif;
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
  font-family: sans-serif;
}
</style>