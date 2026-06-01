<script setup>
import { ref, computed, onMounted } from 'vue'

const userIdCookie = useCookie('userId')
const savedUserId = computed(() => userIdCookie.value)

const orders = ref([])
const errorMessage = ref('')

const fetchHistory = async () => {
  errorMessage.value = ''

  if (!savedUserId.value) {
    errorMessage.value = 'Nie jesteś zalogowany. Zaloguj się na stronie głównej.'
    return
  }

  try {
    
    const response = await $fetch(`http://localhost:5000/orders?userId=${savedUserId.value}`, {
      method: 'GET'
    })

    if (response && response.status === 200) {
      orders.value = response.payload
    }
  } catch (error) {
    console.error("Błąd ładowania historii:", error)
    errorMessage.value = 'Nie udało pobrać się historii zamówień z bazy.'
  }
}

const deleteOrder = async (orderId) => {
  if (!confirm('Czy na pewno chcesz usunąć to zamówienie?')) return

  try {
    const response = await $fetch(`http://localhost:5000/orders/${orderId}`, {
      method: 'DELETE',
      body: {
        userId: savedUserId.value 
      }
    })

    if (response && response.status === 200) {
      await fetchHistory()
    }
  } catch (error) {
    console.error('Błąd podczas usuwania:', error)
    alert('Nie udało się usunąć zamówienia.')
  }
}

const logout = () => {
    userIdCookie.value = null
    return navigateTo('/')
}

onMounted(async () => {
  if (savedUserId.value) {
    await fetchHistory()
  } else {
    errorMessage.value = 'Nie jesteś zalogowany. Zaloguj się na stronie głównej.'
  }
})
</script>

<template>
  <div class="page-container">
    <header class="navbar">
      <nav>
        <NuxtLink to="/" class="nav-item">Strona Główna</NuxtLink> |
        <NuxtLink to="/order" class="nav-item">Złóż zamówienie</NuxtLink> |
        <NuxtLink to="/history" class="nav-item active">Historia zamówień</NuxtLink> |
        <NuxtLink to="/results" class="nav-item">Moje wyniki</NuxtLink> |
        <span class="nav-item" @click="logout">Wyloguj</span>
      </nav>
    </header>
    <main class="main-content">
      <h2>Historia Zamówień</h2>
      <p v-if="orders.length === 0 && !errorMessage" class="no-orders">
        Brak złożonych zamówień w historii.
      </p>
      <p v-if="errorMessage" class="message-error">{{ errorMessage }}</p>
      <table v-if="orders.length > 0" class="history-table">
        <thead>
          <tr>
            <th>Wiek</th>
            <th>Ilość próbek</th>
            <th>Badania</th>
            <th>Data</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.age }}</td>
            <td>{{ order.quantity || order.quantity_samples || 1}}</td>
            <td>{{ order.tests || order.sample_type || 'Brak badań' }}</td>
            <td>
              {{ order.order_date ? new Date(order.order_date).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
              }) : 'Brak daty' }}
            </td>
            <td>
              <span class="action-btn delete" @click="deleteOrder(order.id)">[Usuń]</span>
              <NuxtLink :to="`/order?id=${order.id}`" class="action-btn edit">[Edytuj]</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>



<style scoped>

.page-container {
  min-height: 100vh;
  font-family: 'Garamond', 'Georgia', system-ui, sans-serif; 
  background-color: #f2f0ea;
  box-sizing: border-box;
  padding: 24px;
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

h2 {
  font-size: 26px;
  color: #2e1f15; 
  margin-top: 0;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
  border-bottom: 2px solid #e8e1d5;
  padding-bottom: 12px;
}

.history-table {
  width: 100%;
  text-align: left;
  font-size: 14px;
  border:1px solid #2e1f15;
  border-collapse: separate;
  border-radius: 16px;
  border-spacing: 0;
  overflow: hidden;
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
  border-bottom: 1px solid #2e1f15;
  border-right: 1px solid #2e1f15;
}

.history-table tbody td {
  color: #2e1f15;
}

.history-table tbody tr:hover {
  background-color: #f1f3ed;
}

.action-btn {
  margin-right: 10px;
  cursor: pointer;
  text-decoration: none;
}

.action-btn.delete { color: #d32f2f; }
.action-btn.edit { color: #1976d2; }
</style>