<!-- Navbar.vue -->
<template>
  <header class="navbar">
    <div class="container">
      <!-- Logo -->
      <router-link
        to="/"
        class="logo"
        aria-label="StayCatCity Home"
      >
        StayCatCity
      </router-link>

      <!-- Navigation -->
      <nav
        class="nav-links"
        aria-label="Main Navigation"
      >
        <router-link
          to="/"
          aria-label="Go to Home page"
        >
          Home
        </router-link>

        <router-link
          to="/hotels"
          aria-label="Go to Hotels page"
        >
          Hotels
        </router-link>

        <!-- Logged In -->
        <template v-if="isLoggedIn">
          <router-link
            to="/dashboard"
            aria-label="Go to Dashboard page"
          >
            Dashboard
          </router-link>

          <router-link
            to="/history"
            aria-label="Go to Booking History page"
          >
            History
          </router-link>

          <button
            class="logout-btn"
            @click="logout"
            aria-label="Logout account"
          >
            Logout
          </button>
        </template>

        <!-- Not Logged In -->
        <template v-else>
          <router-link
            to="/login"
            class="login-btn"
            aria-label="Go to Login page"
          >
            Login
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)

/* Check login status */
const checkLogin = () => {
  isLoggedIn.value =
    !!localStorage.getItem('user')
}

/* Run when page loads */
onMounted(() => {
  checkLogin()
})

watch(
  () => route.fullPath,
  () => {
    checkLogin()
  }
)

/* Logout */
const logout = () => {
  localStorage.removeItem('user')
  isLoggedIn.value = false

  Swal.fire({
    icon: 'success',
    title: 'Logged Out',
    text: 'You have been logged out successfully.',
    confirmButtonColor: '#10b981'
  })

  router.push('/login')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Navbar */
.navbar {
  background: #111827;
  padding: 16px 8%;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

/* Container */
.container {
  max-width: 1300px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  color: white;
  font-size: 30px;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: 0.5px;
}

/* Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
}

.nav-links a:hover {
  color: #60a5fa;
}

/* Buttons */
.login-btn,
.logout-btn {
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s;
}

/* Login */
.login-btn {
  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );
  color: white !important;
}

/* Logout */
.logout-btn {
  background: #ef4444;
  color: white;
}

/* Hover */
.login-btn:hover,
.logout-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

/* Accessibility Focus */
a:focus,
button:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 3px;
}

/* Tablet */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 14px;
  }

  .nav-links {
    justify-content: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .logo {
    font-size: 24px;
  }

  .nav-links {
    gap: 12px;
  }

  .login-btn,
  .logout-btn {
    width: 100%;
  }
}
</style>