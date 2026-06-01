<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch('http://localhost:5000/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (response.status === 200) {
      successMessage.value = `Zalogowano pomyślnie!`

      username.value = ''
      password.value = ''
  
      await navigateTo('/order')
    }
  } catch (error) {
    if (error.response && error.response._data) {
      errorMessage.value = error.response._data.error || 'Błąd logowania.'
    } else {
      errorMessage.value = 'Brak połączenia z serwerem.'
    }
  }
}
</script>

<template>
  <div class="page-container">
    <header class="navbar">
      <nav>
        <NuxtLink to="/login" class="nav-item active">Zaloguj się</NuxtLink>
        <NuxtLink to="/register" class="nav-item">Zarejestruj się</NuxtLink>
      </nav>
    </header>

    <main class="main-content">
      <div class="auth-card">
        <h2>Zaloguj się</h2>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login" class="login-label">Login:</label>
            <input 
            v-model="username" 
            id="login" 
            type="text" 
            placeholder="Wpisz login" 
            required />
          </div>

          <div class="form-group">
            <label for="password" class="password-label">Hasło:</label>
            <input 
            v-model="password" 
            id="password" 
            type="password" 
            placeholder="Wpisz hasło" 
            required />
          </div>

          <button type="submit" class="btn-submit">Zaloguj się</button>
        </form>

        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message success">{{ successMessage }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped>

.page-container { 
  display: flex; 
  flex-direction: column; 
  min-height: 100vh; 
  font-family: Arial, sans-serif; 
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
  text-decoration: none; 
}

.nav-item.active { 
  border-bottom: 2px solid #333333; 
  padding-bottom: 5px; 
}

.main-content { 
  flex: 1; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  padding: 40px 20px; 
}

.auth-card { 
  background: #ffffff; 
  padding: 40px; 
  border-radius: 12px; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0); 
  width: 100%; 
  max-width: 400px; 
  border: 1px solid #4a3525; 
}

.auth-card h2 { 
  text-align: center; 
  margin-top: 0; 
  margin-bottom: 30px; 
  font-size: 26px; 
  color: #2e1f15; 
}

.form-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  margin-bottom: 24px; 
  text-align: left; 
}

.form-group label { 
  font-size: 16px; 
  font-weight: 500; 
}

.login-label,
.password-label {
  color: #000000;
}

.form-group input { 
  padding: 12px; 
  border: 1px solid #4a3525; 
  border-radius: 6px; 
  font-size: 15px; 
}

.btn-submit { 
  width: 100%; 
  padding: 14px; 
  background-color: #4caf50; 
  color: #ffffff; 
  border: none; 
  border-radius: 6px; 
  font-size: 17px; 
  font-weight: 700; 
  cursor: pointer; 
  transition: background-color 0.2s; 
}

.btn-submit:hover { 
  background-color: #43a047; 
}

.message { 
  font-weight: bold; 
  text-align: center; 
  margin-top: 15px; 
}

.message.error { 
  color: #e53935; 
}

.message.success { 
  color: #388e3c; 
  }
</style>