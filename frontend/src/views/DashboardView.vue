<template>
  <div class="page">
    <!-- HERO -->
    <section
      class="hero"
      aria-labelledby="dashboard-heading"
    >
      <div class="hero-content">
        <h1 id="dashboard-heading">
          Welcome Back,
          {{ user.name || 'Guest' }}
        </h1>

        <p>
          Manage your profile and security settings
        </p>
      </div>
    </section>

    <!-- CONTENT -->
    <main
      class="container"
      aria-label="Dashboard content"
    >
      <div
        v-if="loading"
        class="loading"
        role="status"
        aria-live="polite"
      >
        Loading dashboard...
      </div>

      <div v-else class="grid">

        <!-- PROFILE CARD -->
        <section
          class="card profile-card"
          aria-labelledby="profile-title"
        >
          <div
            class="avatar"
            aria-hidden="true"
          >
            {{ user.name ? user.name.charAt(0).toUpperCase() : 'G' }}
          </div>

          <h2 id="profile-title">
            User Profile
          </h2>

          <div class="info">
            <div class="row">
              <span>Name</span>
              <p>{{ user.name }}</p>
            </div>

            <div class="row">
              <span>Email</span>
              <p>{{ user.email }}</p>
            </div>

            <div class="row">
              <span>Phone</span>
              <p>{{ user.phone || 'Not set' }}</p>
            </div>
          </div>

        </section>

        <!-- PASSWORD CARD -->
        <section
          class="card"
          aria-labelledby="password-title"
        >
          <h3 id="password-title">
            Change Password
          </h3>

          <label
            for="current-password"
            class="sr-only"
          >
            Current Password
          </label>

          <input
            id="current-password"
            type="password"
            v-model="password.current"
            placeholder="Current Password"
            autocomplete="current-password"
            aria-required="true"
          />

          <label
            for="new-password"
            class="sr-only"
          >
            New Password
          </label>

          <input
            id="new-password"
            type="password"
            v-model="password.new"
            placeholder="New Password"
            autocomplete="new-password"
            aria-required="true"
          />

          <label
            for="confirm-password"
            class="sr-only"
          >
            Confirm New Password
          </label>

          <input
            id="confirm-password"
            type="password"
            v-model="password.confirm"
            placeholder="Confirm New Password"
            autocomplete="new-password"
            aria-required="true"
          />

          <button
            class="btn"
            @click="changePassword"
            aria-label="Update password"
          >
            Update Password
          </button>

          <!-- UPDATE EMAIL -->
          <div class="settings-section">
            <h3>Update Email</h3>

            <label
              for="email"
              class="sr-only"
            >
              Enter new email
            </label>

            <input
              id="email"
              type="email"
              v-model="newEmail"
              placeholder="Enter new email address"
              autocomplete="email"
              aria-required="true"
              aria-label="New email address"
            />

            <button
              class="btn"
              @click="updateEmail"
              aria-label="Update email address"
            >
              Update Email Address
            </button>
          </div>

          <!-- UPDATE PHONE -->
          <div class="settings-section">
            <h3>Update Phone</h3>

            <label
              for="phone"
              class="sr-only"
            >
              Enter new phone number
            </label>

            <input
              id="phone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              v-model="newPhone"
              placeholder="Enter new phone number"
              aria-required="true"
              aria-label="New phone number"
            />

            <button
              class="btn"
              @click="updatePhone"
              aria-label="Update phone number"
            >
              Update Phone Number
            </button>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import Swal from 'sweetalert2'

const loading = ref(false)

const user = ref(
  JSON.parse(localStorage.getItem('user')) || {}
)

const password = ref({
  current: '',
  new: '',
  confirm: ''
})

const newEmail = ref('')

const newPhone = ref('')

const changePassword = async () => {
  if (!user.value.email) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'User not logged in!',
      confirmButtonColor: '#dc2626'
    })
  }

  if (
    !password.value.current ||
    !password.value.new ||
    !password.value.confirm
  ) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill in all fields',
      confirmButtonColor: '#dc2626'
    })
  }

  if (password.value.new.length < 6) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Password must be at least 6 characters',
      confirmButtonColor: '#dc2626'
    })
  }

  if (
    password.value.new !==
    password.value.confirm
  ) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Passwords do not match!',
      confirmButtonColor: '#dc2626'
    })
  }

  try {
    const res = await api.put(
      `/users/${user.value.email}/password`,
      {
        currentPassword:
          password.value.current,
        newPassword:
          password.value.new
      }
    )

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: res.data.message,
      confirmButtonColor: '#10b981'
    })

    password.value = {
      current: '',
      new: '',
      confirm: ''
    }

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        err.response?.data?.message ||
        'Failed to change password',
      confirmButtonColor: '#dc2626'
    })
  }
}

// Update email address
const updateEmail = async () => {
  // Email format validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(newEmail.value)) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        'Please enter a valid email address',
      confirmButtonColor: '#dc2626'
    })
  }

  // Prevent same email
  if (
    newEmail.value === user.value.email
  ) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        'New email cannot be the same as current email',
      confirmButtonColor: '#dc2626'
    })
  }

  try {
    await api.put(
      `/users/${user.value.email}/email`,
      {
        newEmail: newEmail.value
      }
    )

    // Update local user
    user.value.email = newEmail.value

    // Update localStorage
    localStorage.setItem(
      'user',
      JSON.stringify(user.value)
    )

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text:
        'Email address updated successfully.',
      confirmButtonColor: '#10b981'
    })

    newEmail.value = ''

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        err.response?.data?.message ||
        'Failed to update email address',
      confirmButtonColor: '#dc2626'
    })
  }
}

// Update phone number
const updatePhone = async () => {
  if (
    !/^\d{10,15}$/.test(newPhone.value)
  ) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        'Please enter a valid phone number',
      confirmButtonColor: '#dc2626'
    })
  }

  try {
    await api.put(
      `/users/${user.value.email}/phone`,
      {
        phone: newPhone.value
      }
    )

    // update local user
    user.value.phone = newPhone.value

    // update localStorage
    localStorage.setItem(
      'user',
      JSON.stringify(user.value)
    )

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text:
        'Phone number updated successfully.',
      confirmButtonColor: '#10b981'
    })

    newPhone.value = ''

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text:
        err.response?.data?.message ||
        'Failed to update phone number',
      confirmButtonColor: '#dc2626'
    })
  }
}
</script>

<style scoped>

main {
  flex: 1;
}

.page {
  min-height: 100vh;
  background: #f0f9ff;
  display: flex;
  flex-direction: column;
}

/* HERO */
.hero {
  height: 260px;
  background:
    linear-gradient(
      135deg,
      #1d4ed8,
      #2563eb
    );
  color: white;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: auto;
  padding: 0 8%;
}

.hero h1 {
  font-size: 42px;
  margin-bottom: 8px;
}

.hero p {
  font-size: 18px;
  opacity: 0.9;
}

/* CONTAINER */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 60px 40px;
}

/* GRID */
.grid {
 display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
/* CARD */
.card {
  background: white;
  padding: 25px;
  border-radius: 18px;
  box-shadow:
    0 10px 25px rgba(0,0,0,.06);

  display: flex;
  flex-direction: column;
  height: 100%;
}

/* PROFILE CARD */
.profile-card {
  text-align: center;
}

.avatar {
  width: 70px;
  height: 70px;
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
  font-size: 28px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}

/* INFO */
.info {
  margin-top: 20px;
  text-align: left;
  
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.row span {
  color: #6b7280;
}

/* UPDATE PHONE */
.update-phone {
  margin-top: 20px;
}

/* INPUT */
input {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  box-sizing: border-box;
}

input:focus,
button:focus,
button:focus-visible {
  border-color: #2563eb;
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* BUTTON */
.btn {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

/* LOADING */
.loading {
  text-align: center;
  padding: 50px;
  color: #6b7280;
}

/* SCREEN READER ONLY */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .hero h1 {
    font-size: 32px;
  }
}
</style>