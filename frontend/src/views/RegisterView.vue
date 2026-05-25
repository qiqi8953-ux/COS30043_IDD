<template>
  <main
    class="page"
    aria-labelledby="register-heading"
  >
    <div
      class="register-card"
      role="region"
      aria-label="Register account section"
    >
      <!-- Left Side -->
      <section
        class="welcome-panel"
        aria-labelledby="welcome-title"
      >
        <h1 id="welcome-title">
          Create Account
        </h1>

        <p>
          Join our Hotel Booking System and start planning your next perfect stay.
        </p>

        <ul aria-label="Member benefits">
          <li>✔ Easy hotel booking</li>
          <li>✔ Manage your trips</li>
          <li>✔ Exclusive member deals</li>
        </ul>
      </section>

      <!-- Right Side -->
      <section
        class="form-panel"
        aria-labelledby="register-heading"
      >
        <h2 id="register-heading">
          Register
        </h2>

        <p class="subtitle">
          Please fill in your details
        </p>

        <form
          @submit.prevent="register"
          aria-label="Registration form"
        >
          <!-- Full Name -->
          <div class="input-group">
            <label for="name">
              Full Name
            </label>

            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              required
              aria-required="true"
            />
          </div>

          <!-- Email -->
          <div class="input-group">
            <label for="email">
              Email Address
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
              aria-required="true"
            />
          </div>

          <!-- Phone -->
          <div class="input-group">
            <label for="phone">
              Phone Number
            </label>

            <input
              id="phone"
              v-model="phone"
              type="tel"
              placeholder="Enter your phone number"
              autocomplete="tel"
              inputmode="numeric"
              required
              aria-required="true"
            />
          </div>

          <!-- Password -->
          <div class="input-group">
            <label for="password">
              Password
            </label>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              required
              aria-required="true"
            />
          </div>

          <!-- Confirm Password -->
          <div class="input-group">
            <label for="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm password"
              autocomplete="new-password"
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            class="register-btn"
            aria-label="Create account"
          >
            Create Account
          </button>
        </form>

        <p class="login-link">
          Already have an account?

          <router-link
            to="/login"
            aria-label="Go to login page"
          >
            Login here
          </router-link>
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = async () => {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Passwords do not match',
      confirmButtonColor: '#dc2626'
    })
    return
  }

    if (!/^\d{10,15}$/.test(phone.value)) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter a valid phone number',
      confirmButtonColor: '#dc2626'
    })
    return
  }


  if (!/^.{6,20}$/.test(password.value)) {
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Password must be between 6 and 20 characters',
    confirmButtonColor: '#dc2626'
  })
}

  try {
    let response = await fetch(
      'https://cos30043-idd-backend.onrender.com/api/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: phone.value,
          password: password.value
        })
      }
    )

    let data = await response.json()

     if (!response.ok) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: data.message || 'Registration failed',
      confirmButtonColor: '#dc2626'
    })
    return
  }

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: data.message,
      confirmButtonColor: '#10b981'
    })

    router.push('/login')

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Registration failed',
      confirmButtonColor: '#dc2626'
    })

    console.log(error)
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

.register-card {
  width: 100%;
  max-width: 1050px;
  min-height: 650px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow:
    0 25px 60px
    rgba(0, 0, 0, 0.18);
}

/* Left Panel */
.welcome-panel {
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

.welcome-panel h1 {
  font-size: 42px;
  margin-bottom: 18px;
}

.welcome-panel p {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 28px;
  opacity: 0.95;
}

.welcome-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.welcome-panel li {
  margin-bottom: 14px;
  font-size: 16px;
}

/* Right Panel */
.form-panel {
  padding: 55px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-panel h2 {
  font-size: 34px;
  color: #111827;
  margin-bottom: 8px;
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
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.input-group input {
  width: 100%;
  padding: 14px 15px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  transition: 0.25s;
}

/* ACCESSIBILITY */
.input-group input:focus,
.register-btn:focus,
.login-link a:focus {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.input-group input:focus {
  border-color: #8fb0f8;
  box-shadow:
    0 0 0 4px
    rgba(37, 99, 235, 0.12);
}

.register-btn {
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
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.25s;
}

.register-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 14px 24px
    rgba(37, 99, 235, 0.25);
}

.login-link {
  margin-top: 22px;
  text-align: center;
  color: #6b7280;
}

.login-link a {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
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

/* Responsive */
@media (max-width: 900px) {
  .register-card {
    grid-template-columns: 1fr;
  }

  .welcome-panel {
    padding: 40px 30px;
  }

  .form-panel {
    padding: 40px 30px;
  }

  .welcome-panel h1 {
    font-size: 34px;
  }
}

@media (max-width: 500px) {
  .page {
    padding: 15px;
  }

  .form-panel,
  .welcome-panel {
    padding: 28px 20px;
  }

  .form-panel h2 {
    font-size: 28px;
  }
}
</style>