<template>
  <main
    class="page"
    aria-labelledby="login-heading"
  >
    <div
      class="login-card"
      role="region"
      aria-label="Login form section"
    >
      <!-- Left Side -->
      <section
        class="left-panel"
        aria-labelledby="welcome-title"
      >
        <h1 id="welcome-title">
          Welcome Back
        </h1>

        <p>
          Login to manage your hotel bookings, view upcoming stays,
          and enjoy exclusive member offers.
        </p>

        <ul aria-label="Member benefits">
          <li>✔ Easy Booking Management</li>
          <li>✔ Secure User Account</li>
          <li>✔ Exclusive Travel Deals</li>
        </ul>
      </section>

      <!-- Right Side -->
      <section
        class="right-panel"
        aria-labelledby="login-heading"
      >
        <h2 id="login-heading">
          Login
        </h2>

        <p class="subtitle">
          Please enter your account details
        </p>

        <form
          @submit.prevent="login"
          aria-label="Login form"
        >
          <div class="input-group">
            <label for="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              v-model="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
              aria-required="true"
            />
          </div>

          <div class="input-group">
            <label for="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
              aria-required="true"
            />
          </div>

          <button
            class="login-btn"
            type="submit"
            aria-label="Login account"
          >
            Login Account
          </button>
        </form>

        <p class="register-text">
          Don't have an account?

          <router-link
            to="/register"
            aria-label="Go to registration page"
          >
            Register here
          </router-link>
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import Swal from 'sweetalert2'

const router = useRouter()

const email = ref('')
const password = ref('')

const login = async () => {
  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem(
      'user',
      JSON.stringify(res.data)
    )

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Login successful!',
      confirmButtonColor: '#10b981'
    })

    router.push('/dashboard')

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        error.response?.data?.message ||
        'Invalid login',
      confirmButtonColor: '#dc2626'
    })
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: #f0f9ff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.login-card {
  width: 100%;
  max-width: 1050px;
  min-height: 620px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
}

.left-panel {
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
  padding: 60px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-panel h1 {
  font-size: 42px;
  margin-bottom: 20px;
}

.left-panel p {
  line-height: 1.7;
  margin-bottom: 28px;
}

.left-panel ul {
  list-style: none;
  padding: 0;
}

.left-panel li {
  margin-bottom: 14px;
}

.right-panel {
  padding: 55px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-panel h2 {
  font-size: 34px;
  margin-bottom: 10px;
  color: #111827;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 28px;
}

.input-group {
  margin-bottom: 18px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.input-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
}

/* ACCESSIBILITY */
.input-group input:focus,
.login-btn:focus,
.register-text a:focus {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.input-group input:focus {
  border-color: #8fb0f8;
  box-shadow:
    0 0 0 4px
    rgba(37, 99, 235, 0.1);
}

.login-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
  transition: 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
}

.register-text {
  margin-top: 22px;
  text-align: center;
}

.register-text a {
  color: #2563eb;
  font-weight: bold;
  text-decoration: none;
}

/* SCREEN READER ONLY */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .left-panel,
  .right-panel {
    padding: 35px 28px;
  }
}
</style>