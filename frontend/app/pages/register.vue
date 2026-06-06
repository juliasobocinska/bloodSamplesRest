<script setup>
import { ref } from 'vue'

const fullName = ref('')
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const passwordValue = password.value
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/

  if (!passwordRegex.test(passwordValue)) {
    errorMessage.value = 'Hasło musi mieć minimum 8 znaków, zawierać co najmniej jedną wielką literę oraz jedną cyfrę!'
    return 
  }

  const formattedFullName = fullName.value.trim().replace(/\b\w/g, c => c.toUpperCase())

  try {
    const response = await $fetch('http://localhost:3000/register', {
      method: 'POST',
      body: {
        full_name: formattedFullName,
        password: password.value,
        username: username.value
      }
    })

    if (response.status === 200 || response.status === 201) {
      successMessage.value = `Konto zostało utworzone. Przejź do zakładki zaloguj.`
      fullName.value = ''
      password.value = ''
      username.value = ''
  
      setTimeout(async () => {
        await navigateTo('/login')
      }, 2000)
    }
  } catch (error) {
    if (error.response && error.response._data) {
      errorMessage.value = error.response._data.error || 'Błąd rejstracji.'
    } else {
      errorMessage.value = 'Brak połączenia z serwerem.'
    }
  }
}
</script>

<template>
  <div class="page-container">
    <MainNav />

    <main class="main-content">
      <div class="auth-card">
        <h2>Zarejestruj się</h2>
        
        <form @submit.prevent="handleRegister">
          
          <div class="form-group">
            <label for="fullName" class="fullName-label">Imię i Nazwisko:</label>
            <input 
              v-model="fullName" 
              id="fullName" 
              type="text" 
              placeholder="np. Jan Kowalski" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="login" class="login-label">Login:</label>
            <input 
              v-model="username" 
              id="login" 
              type="text" 
              placeholder="Wpisz login" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="password" class="password-label">Hasło:</label>
            <input 
              v-model="password" 
              id="password" 
              type="password" 
              placeholder="Wpisz bezpieczne hasło" 
              required 
            />
          </div>

          <button type="submit" class="btn-submit">Zerejstruj się</button>
        </form>

        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message success">{{ successMessage }}</p>
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

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.auth-card { 
  padding: 20px;
  background-color: #2e1f151f;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(122, 82, 82, 0.582);
  width: 100%;
  max-width: 500px;
  border: 1px solid #4a3525;
}

.auth-card h2 { 
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

.form-group input:active {
  background-color: #999999;
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