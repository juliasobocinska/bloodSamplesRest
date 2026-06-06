<template>
    <header class="navbar">
      <nav>
        <NuxtLink to="/" :class="['nav-item', { active: isActive('/') }]">Strona Główna</NuxtLink> |
        <template v-if="role === 'logout'" >
          <NuxtLink to="/login" :class="['nav-item', { active: isActive('/login') }]">Zaloguj się</NuxtLink> |
          <NuxtLink to="/register" :class="['nav-item', { active: isActive('/register') }]">Zarejestruj się</NuxtLink> |
        </template>
        <template v-if="role === 'laborant'">
          <NuxtLink to="/lab" :class="['nav-item', { active: isActive('/lab') }]">Panel Laboranta</NuxtLink> |
        </template>
        <template v-if="role === 'user'">
          <NuxtLink to="/order" :class="['nav-item', { active: isActive('/order') }]">Złóż zamówienie</NuxtLink> |
          <NuxtLink to="/history" :class="['nav-item', { active: isActive('/history') }]">Historia zamówień</NuxtLink> | 
          <NuxtLink to="/results" :class="['nav-item', { active: isActive('/results') }]">Moje wyniki</NuxtLink> |
        </template>
        <span v-if="role !== 'logout'" class="nav-item logout"  @click="logout">Wyloguj</span> 
        <UColorModeButton />
      </nav>
    </header>
</template>


<script setup>
const route = useRoute()

const logout = () => {
    useCookie('userId').value = null
    useCookie('userRole').value = null
    useCookie('auth_token').value = null
    return navigateTo('/login') 
}

const role = ref('logout')

const isActive = (path) => route.path === path

onMounted(() => {
  const userIdCookie = useCookie('userId')
  const userRoleCookie = useCookie('userRole')

  if (userIdCookie.value) {
    if (userRoleCookie.value === 'laborant') {
      role.value = 'laborant'
    } else {
      role.value = 'user'
    }
  }
})

</script>

<style scoped>
.logout {
  cursor: pointer;
}

.navbar {
  max-width: 1100px;
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
</style>