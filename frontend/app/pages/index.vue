<script setup>
import {ref} from 'vue'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const showRegisterLink = ref(false)

// wysyłanie danych do bckd
const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  showRegisterLink.value = false


  try {
    const response = await $fetch('http://localhost:5000/login', {
      method: 'POST',
      credentials: 'include',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (response.status === 200) {
      successMessage.value = `Witaj, ${response.payload.full_name}!`

      username.value = ''
      password.value = ''

      const userCookie = useCookie('userId')
      userCookie.value = response.payload.id

      await navigateTo('/order')
    }
  } catch (error) {
  if (error.response) {
    if (error.response.status === 401) {
      errorMessage.value = 'Błędny login lub hasło. Sprawdź dane lub zarejestruj nowe konto.'
      showRegisterLink.value = true
    } else {
      // Wyświetli nam np. "Błąd serwera (Status: 500)" lub "Status: 404"
      errorMessage.value = error.response._data?.error || `Błąd serwera (Status: ${error.response.status})`
    }
  } else {
    // Jeśli zapytanie w ogóle nie dotarło do portu 5000 (np. przez blokadę CORS)
    errorMessage.value = `Błąd połączenia: ${error.message || 'CORS lub zły adres URL'}`
  }
}
  }
</script>

<template>
  <div class="page-container">
    <header class="navbar">
  <nav>
    <span class="nav-item active">Strona Główna</span>
    
    <NuxtLink to="/register" class="nav-item">Zarejestruj się</NuxtLink>
  </nav>
</header>

    <main class="main-content">
      <div class="login-card">
        <h2>Zaloguj się</h2>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login">Login:</label>
            <input
              v-model="username"
              id="login"
              type="text"
              placeholder="Wpisz login"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Hasło:</label>
            <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Wpisz hasło"
            required
            />
          </div>

          <button type="submit" class="btn-submit">Zaloguj się</button>
        </form>

        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message success">{{ successMessage }}</p>
      </div>
    </main>

    <footer class="footer">
      <p>&copy; 2026 BloodSamples&trade;</p>
    </footer>
  </div>
</template>



<style scoped>

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f2f0ea;
}

.navbar {
  border-bottom: 1px solid #4a3525;
  padding: 20px 40px;
}

.navbar nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  font-size: 16px;
  font-weight: 700;
  color: #333333;
  cursor: pointer;
  padding-bottom: 5px;
}

.nav-item.active {
  border-bottom: 2px solid #4a3525;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; 
  padding: 40px 20px;
}

.login-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  border: 1px solid #4a3525;
}

.login-card h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 28px;
  color: #2e1f15;
  font-weight: 700;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.form-group label {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.form-group input {
  padding: 12px;
  border: 1px solid #4a3525;
  border-radius: 6px;
  font-size: 15px;
  color: #333333;
  background-color: #ffffff;
}

.form-group input::placeholder {
  color: #999999;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 10px;
}

.btn-submit:hover {
  background-color: #43a047;
}

/* Powiadomienia */
.message {
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 14px;
}
.message.error { color: #d32f2f; }
.message.success { color: #388e3c; }

/* Stopka na dole */
.footer {
  text-align: center;
  padding: 30px;
  border-top: 1px solid #4a3525;
  color: #888888;
  font-size: 14px;
}
</style>