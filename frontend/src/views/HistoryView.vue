<template>
  <div class="page">
    <!-- Hero -->
    <section
      class="hero"
      aria-labelledby="history-heading"
    >
      <div class="hero-content">
        <h1 id="history-heading">
          Transaction History
        </h1>

        <p>
          View all your hotel booking transactions, including past and upcoming stays.
        </p>
      </div>
    </section>

    <!-- Content -->
    <main
      class="container"
      aria-label="Transaction history content"
    >
      <div
        v-if="loading"
        class="loading"
        role="status"
        aria-live="polite"
      >
        Loading transactions...
      </div>

      <div
        v-else-if="bookings.length === 0"
        class="empty"
        role="alert"
      >
        <h2>No Transactions Found</h2>

        <p>
          You have not made any bookings yet.
        </p>

        <router-link to="/hotels">
          <button
            aria-label="Browse available hotels"
          >
            Browse Hotels
          </button>
        </router-link>
      </div>

      <div v-else>
        <!-- Summary -->
        <section
          class="summary-grid"
          aria-label="Booking summary"
        >
          <div class="summary-card">
            <h3>Total Transactions</h3>
            <p>{{ bookings.length }}</p>
          </div>

          <div class="summary-card">
            <h3>Upcoming Stays</h3>
            <p>{{ upcomingTrips }}</p>
          </div>

          <div class="summary-card">
            <h3>Completed Stays</h3>
            <p>{{ completedTrips }}</p>
          </div>
        </section>

        <!-- Booking Cards -->
        <section
          class="grid"
          aria-label="Booking list"
        >
          <article
            class="card"
            v-for="(booking, index) in bookings"
            :key="index"
          >
            <!-- TOP -->
            <div class="top-row">
              <h2>
                Booking #{{ bookings.length - index }}
              </h2>

              <span
                class="status upcoming"
                v-if="new Date(booking.checkoutDate) > today"
              >
                Upcoming
              </span>

              <span
                class="status completed"
                v-else
              >
                Completed
              </span>
            </div>

            <!-- IMAGE -->
            <img
              :src="booking.roomImage"
              :alt="booking.roomType + ' room at ' + booking.hotelName"
              class="room-img"
            />

            <!-- DETAILS -->
            <p class="hotel">
              {{ booking.hotelName }}
            </p>

            <p class="user">
              {{ booking.roomType }}
            </p>

            <p class="date">
              Check-in: {{ booking.date }}
            </p>

            <p class="date">
              Check-out: {{ booking.checkoutDate }}
            </p>

            <p class="price">
              💰 RM {{ booking.totalPrice }}
            </p>

            <!-- BUTTON -->
            <div class="bottom-row">
              <router-link
                :to="{
                  path: '/booking/' + booking.hotelId,
                  query: {
                    room: booking.roomType,
                    price: booking.roomPrice
                  }
                }"
              >
                <button
                  :aria-label="'Book ' + booking.roomType + ' again at ' + booking.hotelName"
                >
                  Book Again
                </button>
              </router-link>
            </div>
          </article>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'

const bookings = ref([])
const loading = ref(true)

const user =
  JSON.parse(localStorage.getItem('user')) || {}

const today = new Date()

onMounted(async () => {
  try {
    const res = await api.get('/bookings')

    bookings.value = res.data
      .filter((b) => b.user === user.email)
      .reverse()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})

const upcomingTrips = computed(() => {
  return bookings.value.filter(
    (b) => new Date(b.checkoutDate) > today
  ).length
})

const completedTrips = computed(() => {
  return bookings.value.filter(
    (b) => new Date(b.checkoutDate) <= today
  ).length
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: #f0f9ff;
}

/* Hero */
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
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0 8%;
}

.hero h1 {
  font-size: 44px;
  margin-bottom: 10px;
}

.hero p {
  max-width: 650px;
  line-height: 1.7;
  font-size: 17px;
}

/* Content */
.container {
  max-width: 1200px;
  margin: auto;
  padding: 50px 8%;
}

/* Summary */
.summary-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(220px,1fr));
  gap: 24px;
  margin-bottom: 35px;
}

.summary-card {
  background: white;
  padding: 25px;
  border-radius: 18px;
  box-shadow:
    0 10px 25px rgba(0,0,0,0.07);
}

.summary-card h3 {
  color: #6b7280;
  margin-bottom: 10px;
}

.summary-card p {
  font-size: 32px;
  font-weight: bold;
  color: #111827;
}

/* Booking Cards */
.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(320px,1fr));
  gap: 24px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 18px;
  box-shadow:
    0 10px 25px rgba(0,0,0,0.07);
}

.hotel {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  margin-top: 14px;
}

/* Room Type */
.user {
  color: #374151; 
  font-size: 16px;
  font-weight: 500;
  margin-top: 12px;
}

/* Check-in / Check-out */
.date {
  color: #374151; 
  font-size: 15px;
  font-weight: 500;
  margin-top: 10px;
}

.price {
  color: #2563eb; 
  font-size: 22px;
  font-weight: 800;
  margin-top: 18px;
}

.room-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 12px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.card h2 {
  font-size: 24px;
  color: #111827;
}

.status {
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: bold;
}

.upcoming {
  background: #dcfce7;
  color: #166534;
}

.completed {
  background: #e5e7eb;
  color: #374151;
}


.bottom-row {
  margin-top: 22px;
}

button {
  padding: 11px 16px;
  border: none;
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  opacity: 0.92;
}

/* Accessibility */
button:focus,
button:focus-visible,
a:focus,
a:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* Empty */
.empty,
.loading {
  text-align: center;
  padding: 70px 20px;
}

.empty h2,
.loading {
  color: #111827;
  margin-bottom: 12px;
}

.empty p {
  color: #6b7280;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    height: auto;
    padding: 40px 0;
  }

  .hero h1 {
    font-size: 34px;
  }

  .summary-card p {
    font-size: 28px;
  }
}

@media (max-width: 500px) {
  .container {
    padding: 35px 20px;
  }

  .hero-content {
    padding: 0 20px;
  }

  .hero h1 {
    font-size: 28px;
  }

  .top-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>