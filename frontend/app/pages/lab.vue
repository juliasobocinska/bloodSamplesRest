<script setup>
import { ref, onMounted } from 'vue'

const tokenCookie = useCookie('auth_token')
const userRoleCookie = useCookie('userRole')

const orderId = ref('')
const testName = ref('')
const testValue = ref('')
const errorMessage = ref('')
const successMessage = ref('')

// Zabezpieczenie strony przed zwykłymi pacjentami
onMounted(() => {
    if (userRoleCookie.value !== 'laborant') {
        navigateTo('/') // Wyrzuca na stronę główną, jeśli to nie laborant
    }
})

const submitResult = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    // 1. Pobieramy token bezpośrednio z ciasteczka
    const token = useCookie('auth_token').value

    if (!token) {
        errorMessage.value = 'Brak tokena sesji. Zaloguj się ponownie.'
        return
    }

    try {
        const response = await $fetch('http://localhost:3000/results', {
            method: 'POST',
            // 2. MUSISZ DODAĆ NAGŁÓWEK AUTORYZACJI
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: {
                orderId: parseInt(orderId.value),
                testName: testName.value,
                value: parseFloat(testValue.value.replace(',', '.')) // Obsługa przecinka
            }
        })

        successMessage.value = 'Wynik został poprawnie zapisany w bazie!'
        orderId.value = ''
        testName.value = ''
        testValue.value = ''

    } catch (error) {
        if (error.response && error.response.status === 403) {
            errorMessage.value = 'Brak uprawnień do dodawania wyników!'
        } else {
            errorMessage.value = error.response?._data?.error || 'Wystąpił błąd podczas zapisywania wyniku.'
        }
    }
}

const logout = () => {
    useCookie('userId').value = null
    useCookie('userRole').value = null
    useCookie('auth_token').value = null
    return navigateTo('/')
}
</script>

<template>
    <div class="page-container">
        <header class="navbar">
            <nav>
                <span class="nav-item active">Panel Laboranta</span> |
                <span class="nav-item logout" @click="logout">Wyloguj</span>
            </nav>
        </header>

        <main class="main-content">
            <div class="lab-card">
                <h2>Wprowadź Wynik Badania</h2>

                <form @submit.prevent="submitResult">
                    <div class="form-group">
                        <label>ID Zamówienia:</label>
                        <input v-model="orderId" type="number" placeholder="Np. 12" required />
                    </div>

                    <div class="form-group">
                        <label>Nazwa Badania:</label>
                        <select v-model="testName" required>
                            <option value="" disabled>Wybierz z listy...</option>
                            <option value="Anemia">Anemia</option>
                            <option value="Glukoza">Glukoza</option>
                            <option value="Morfologia pełna">Morfologia pełna</option>
                            <option value="Tarczyca (TSH)">Tarczyca (TSH)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Wartość Wyniku:</label>
                        <input v-model="testValue" type="number" step="0.01" placeholder="Np. 85.5" required />
                    </div>

                    <button type="submit" class="btn-submit">Zapisz w systemie</button>
                </form>

                <p v-if="successMessage" class="message success">{{ successMessage }}</p>
                <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
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
    color: #5c5146;
    font-weight: bold;
    font-size: 14px;
    margin: 0 16px;
}

.nav-item.active {
    color: #8b5a2b;
    border-bottom: 3px solid #8b5a2b;
    padding-bottom: 4px;
}

.logout {
    cursor: pointer;
}

.main-content {
    display: flex;
    justify-content: center;
}

.lab-card {
    padding: 30px;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 450px;
    border: 2px solid #dfdad0;
}

h2 {
    color: #2e1f15;
    text-align: center;
    margin-top: 0;
    border-bottom: 2px solid #e8e1d5;
    padding-bottom: 12px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.form-group label {
    font-weight: bold;
    color: #444444;
}

.form-group input,
.form-group select {
    padding: 12px;
    border: 1px solid #dfdad0;
    border-radius: 6px;
    font-size: 15px;
    background-color: #faf9f5;
}

.btn-submit {
    width: 100%;
    padding: 14px;
    background-color: #8b5a2b;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
}

.btn-submit:hover {
    background-color: #704822;
}

.message {
    font-weight: bold;
    text-align: center;
    margin-top: 15px;
}

.message.error {
    color: #d32f2f;
}

.message.success {
    color: #388e3c;
}
</style>