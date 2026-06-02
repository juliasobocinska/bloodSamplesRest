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
    <span class="nav-item active">Strona Główna</span> |
    
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

.login-card {
  padding: 20px;
  background-color: #2e1f151f;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(122, 82, 82, 0.582);
  width: 100%;
  max-width: 500px;
  border: 1px solid #4a3525;
}

.login-card h2 {
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

.form-group input::placeholder {
  color: #999999;
}

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

.btn-submit:hover {
  background-color: #2e1f15;
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