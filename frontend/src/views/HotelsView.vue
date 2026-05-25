<template>
  <div class="page">
    <!-- Skip Link -->
    <a
      href="#main-content"
      class="skip-link"
    >
      Skip to main content
    </a>

    <!-- Hero -->
    <section
      class="hero"
      aria-label="Hotel search section"
    >
      <div class="hero-overlay">
        <h1>Find Your Perfect Stay</h1>

        <p>
          Explore luxury hotels, resorts and city stays.
        </p>

        <label
          for="hotelSearch"
          class="sr-only"
        >
          Search hotel or location
        </label>

        <input
          id="hotelSearch"
          v-model="search"
          type="search"
          placeholder="Search hotel or location..."
          aria-label="Search hotel or location"
        />
      </div>
    </section>

    <!-- Listing -->
    <main
      id="main-content"
      class="container"
    >
      <div
        class="top-row"
        id="available-hotels"
      >
        <h2>Available Hotels</h2>

        <span
          aria-live="polite"
        >
          {{ filteredHotels.length }} Hotels Found
        </span>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="loading"
        role="status"
        aria-live="polite"
      >
        Loading hotels...
      </div>

      <!-- Hotel Cards -->
      <div
        v-else
        class="grid"
        id="hotel-grid"
      >
        <article
          class="card"
          v-for="hotel in paginatedHotels"
          :key="hotel.id"
          :aria-labelledby="'hotel-name-' + hotel.id"
        >
          <!-- Hotel Image -->
          <div class="img-wrap">
            <img
              :src="hotel.image"
              :alt="hotel.name + ' hotel image'"
            />

            <span
              class="badge"
              aria-label="Popular hotel"
            >
              Popular
            </span>
          </div>

          <!-- Content -->
          <div class="content">
            <h3
              :id="'hotel-name-' + hotel.id"
            >
              {{ hotel.name }}
            </h3>

            <p class="location">
              📍 {{ hotel.location }}
            </p>

            <p
              v-if="hotel.room"
              class="room-type"
            >
              🛏 {{ hotel.room.type }}
            </p>

            <div class="bottom-row">
              <p class="price">
                From RM
                {{
                  hotel.rooms?.[0]?.price ||
                  hotel.price
                }}/night
              </p>

              <router-link
                :to="'/hotel/' + hotel.id"
                :aria-label="'View details for ' + hotel.name"
              >
                <button
                  type="button"
                >
                  View Details
                </button>
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <!-- PAGINATION -->
      <nav
        v-if="totalPageCount > 1"
        aria-label="Hotel pagination"
      >
        <paginate
          :page-count="totalPageCount"
          :click-handler="goToPage"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :active-class="'active'"
        >
        </paginate>
      </nav>

      <!-- Empty -->
      <div
        v-if="!loading && filteredHotels.length === 0"
        class="empty"
        role="alert"
      >
        No hotels found.
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue'

import Paginate from 'vuejs-paginate-next'
import api from '../services/api'

const hotels = ref([])
const loading = ref(true)
const search = ref('')

// PAGINATION
const currentPage = ref(1)
const hotelsPerPage = 6

onMounted(async () => {
  try {
    const res = await api.get('/api/hotels')
    hotels.value = res.data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})

// FILTER
const filteredHotels = computed(() => {
  return hotels.value.filter(hotel =>
    hotel.name
      .toLowerCase()
      .includes(search.value.toLowerCase()) ||

    hotel.location
      .toLowerCase()
      .includes(search.value.toLowerCase()) ||

    (hotel.room &&
      hotel.room.type
        .toLowerCase()
        .includes(search.value.toLowerCase()))
  )
})

// RESET PAGE WHEN SEARCH
watch(search, () => {
  currentPage.value = 1
})

// TOTAL PAGE COUNT
const totalPageCount = computed(() => {
  return Math.ceil(
    filteredHotels.value.length / hotelsPerPage
  )
})

// PAGINATED HOTELS
const paginatedHotels = computed(() => {
  const start =
    (currentPage.value - 1) * hotelsPerPage

  const end = start + hotelsPerPage

  return filteredHotels.value.slice(start, end)
})

// GO TO PAGE
const goToPage = (page) => {
  currentPage.value = page

  setTimeout(() => {
    const hotelGrid =
      document.querySelector('#available-hotels')

    if (hotelGrid) {
      hotelGrid.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, 100)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  background: #f0f9ff;
  min-height: 100vh;
}

/* Skip Link */
.skip-link {
  position: absolute;
  left: -999px;
  top: 10px;
  background: #111827;
  color: white;
  padding: 10px 16px;
  z-index: 9999;
  border-radius: 8px;
  text-decoration: none;
}

.skip-link:focus {
  left: 10px;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

/* Hero */
.hero {
  height: 420px;
  background:
    linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)),
    url("@/assets/hero/Kuchingevening.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero-overlay {
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8%;
}

.hero h1 {
  font-size: 52px;
  margin-bottom: 12px;
}

.hero p {
  margin-bottom: 22px;
}

.hero input {
  max-width: 420px;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
}

.hero input:focus {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* Container */
.container {
  padding: 60px 8%;
}

.top-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 15px;
  flex-wrap: wrap;
}

.top-row h2 {
  font-size: 34px;
}

.top-row span {
  color: #6b7280;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));
  gap: 26px;
}

/* Card */
.card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 10px 25px rgba(0,0,0,.08);
  transition: 0.3s;
}

.card:hover,
.card:focus-within {
  transform: translateY(-8px);
}

.img-wrap {
  position: relative;
}

.img-wrap img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #2563eb;
  color: white;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
}

.content {
  padding: 22px;
}

.content h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.location {
  color: #6b7280;
  margin-bottom: 10px;
}

.room-type {
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 18px;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
}

button {
  padding: 11px 16px;
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
}

button:hover {
  opacity: .92;
}

button:focus,
.pagination :deep(a:focus) {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.loading,
.empty {
  text-align: center;
  padding: 50px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 40px;
  }
}

@media (max-width: 500px) {
  .container,
  .hero-overlay {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero h1 {
    font-size: 30px;
  }

  .bottom-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  button {
    width: 100%;
  }
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
  list-style: none;
  padding: 0;
}

.pagination :deep(li) {
  list-style: none;
}

.pagination :deep(a) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 45px;
  height: 45px;
  padding: 0 14px;
  border-radius: 12px;
  background: white;
  color: #2563eb;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(0,0,0,.08);
  transition: .3s;
}

.pagination :deep(a:hover) {
  background: #dbeafe;
}

.pagination :deep(.active a) {
  background: #2563eb;
  color: white;
}
</style>