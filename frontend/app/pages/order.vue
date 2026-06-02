<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Przechowujemy ID edytowanego zamówienia (null = nowe zamówienie)
const orderId = ref(null)

const age = ref('')
const quantitySamples = ref(1)

const availableTests = ref([
  {id:1, label: 'Tarczyca (TSH)', checked: false},
  {id:2, label: 'Profil lipidowy (Cholesterol)', checked: false},
  {id:3, label: 'Morfologia pełna', checked: false},
  {id:4, label: 'Glukoza', checked: false},
  {id:5, label: 'Witamina D', checked: false},
  {id:6, label: 'Choroby krwi (skaza krwotoczna)', checked: false},
  {id:7, label: 'Alergie', checked: false},
  {id:8, label: 'Grupa krwi', checked: false},
  {id:9, label: 'Zaburzenia elektrolitowe', checked: false},
  {id:10, label: 'Anemia', checked: false},
])

const selectedTests = computed(() => availableTests.value.filter(i => i.checked).map(i => i.label))

const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  const idFromUrl = route.query.id || route.params.id

  if (idFromUrl) {
    orderId.value = idFromUrl
    const token = useCookie('auth_token').value

    if (!token) return

    try {
      const response = await $fetch(`http://localhost:3000/orders/${idFromUrl}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response && response.payload) {
        age.value = response.payload.age
        quantitySamples.value = response.payload.quantity || response.payload.quantity_samples
        
        const savedTests = response.payload.tests ? response.payload.tests.split(', ') : []
        availableTests.value.forEach(test => {
          test.checked = savedTests.includes(test.label)
        })
      }
    } catch (error) {
      console.error("Błąd ładowania danych do edycji:", error)
      errorMessage.value = "Nie udało się pobrać danych zamówienia do edycji."
    }
  }
})

const submitOrder = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const token = useCookie('auth_token').value

  if (!token) {
    errorMessage.value = 'Twoja sesja wygasła. Zaloguj się lub zarejestruj ponownie, aby zapisać zamówienie.'
    return
  }

  try {
    const url = orderId.value ? `http://localhost:3000/orders/${orderId.value}` : 'http://localhost:3000/orders'
    const method = orderId.value ? 'PUT' : 'POST'

    const response = await $fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        age: age.value,
        quantity_samples: quantitySamples.value,
        tests: selectedTests.value
      }
    })

    if (orderId.value) { 
      successMessage.value = 'Zamówienie zostało pomyślnie zaktualizowane!'
      setTimeout(() => navigateTo('/history'), 1500)
    } else {
      successMessage.value = 'Zamówienie zostało pomyślnie złożone!'
      age.value = ''
      quantitySamples.value = 1
      availableTests.value.forEach(test => test.checked = false)
    }
  } catch (error) {
    console.error("Błąd serwera:", error)
    if (error.response && error.response.status === 400) {
      errorMessage.value = error.response._data?.error || 'Błąd zapytania!' 
    } else if (error.response && error.response.status === 401) {
      errorMessage.value = 'Brak autoryzacji. Zaloguj się ponownie.'
    } else {
      errorMessage.value = orderId.value ? 'Wystąpił błąd podczas aktualizacji zamówienia.' : 'Wystąpił błąd podczas składania zamówienia.'
    }
  }
}

const logout = () => {
    useCookie('userId').value = null
    useCookie('userRole').value = null
    useCookie('auth_token').value = null
    return navigateTo('/login') 
}

</script>

<template>
  <div class="page-container">
    <header class="navbar">
      <nav>
        <NuxtLink to="/" class="nav-item">Strona Główna</NuxtLink> |
        <NuxtLink to="/order" class="nav-item active">Złóż zamówienie</NuxtLink> |
        <NuxtLink to="/history" class="nav-item">Historia zamówień</NuxtLink> | 
        <NuxtLink to="/results" class="nav-item">Moje wyniki</NuxtLink> |
        <span class="nav-item logout"  @click="logout">Wyloguj</span> 
      </nav>
    </header>

    <main class="main-content">
      <div class="order-card">
        <h2>{{ orderId ? 'Edycja zamówienia' : 'Zestaw do samodzielnego pobrania krwii' }}</h2>

        <form @submit.prevent="submitOrder">
          <div class="form-group">
            <label for="age">Wiek:</label>
            <input
              v-model="age"
              id="age"
              type="number"
              min="18"
              max="110"
              placeholder="Wpisz wiek"
              required
            />
          </div>

          <div class="form-group">
            <label for="quantitySamples">Ilość próbek:</label>
            <input
              v-model="quantitySamples"
              id="quantitySamples"
              type="number"
              min="1"
              max="5"
              required
            />
          </div>

          <div class="test-container">
            <p class="section-title">Wybierz badania (max 5):</p>
            <div v-for="test in availableTests" :key="test.id" class="checkbox-item">
              <UCheckbox
                type="checkbox"
                :label="test.label"
                v-model="test.checked"
                class="accent-rose-500"
                :ui="{ base: 'data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500'}"
              />
            </div>
          </div>

          <button type="submit" class="btn-submit">
            {{ orderId ? 'Zapisz zmiany' : 'Prześlij' }}
          </button>
        </form>

        <p v-if="successMessage" class="message success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
  .logout {
    cursor: pointer;
  }

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

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.order-card {
  padding: 20px;
  background-color: #2e1f151f;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(122, 82, 82, 0.582);
  width: 100%;
  max-width: 500px;
  border: 1px solid #4a3525;
}

.order-card h2 {
  font-size: 26px;
  color: #2e1f15; 
  margin-top: 0;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
  border-bottom: 2px solid #2e1f155a;
  padding-bottom: 12px;
  justify-self: center;
  align-items: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  font-size: 15px;
  font-weight: 600;
  color: #444444;
}

.form-group input {
  padding: 12px;
  border: 1px solid #4a3525;
  border-radius: 6px;
  font-size: 15px;
  background-color: #e9e8e5e2;
  color: #2e1f15;
  transition: border-color 0.2s ease;
}

.test-container {
  margin: 20px 0;
  text-align: left;
  color: #2e1f15;
}
.section-title {
  font-weight: bold;
  margin-bottom: 10px;
}
.message {
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
}
.message.error { color: #671111; }
.message.success { color: #043d0f; }

.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #2e1f15;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 10px;
}
</style>