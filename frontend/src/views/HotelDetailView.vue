<template>
  <div class="page">
    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-section"
      role="status"
      aria-live="polite"
    >
      <div
        class="loader"
        aria-hidden="true"
      ></div>

      <p>Loading hotel details...</p>
    </div>

    <!-- Content -->
    <main
      v-else-if="hotel"
      id="main-content"
    >
      <!-- HERO -->
      <section
        class="hero"
        aria-label="Hotel hero section"
      >
        <img
          :src="hotel.image"
          :alt="hotel.name + ' hotel image'"
          class="hero-image"
        />

        <div class="hero-overlay">
          <div class="hero-content">
            <span
              class="tag"
              aria-label="Luxury stay"
            >
              Luxury Stay
            </span>

            <h1>{{ hotel.name }}</h1>

            <!-- CLICKABLE LOCATION -->
            <p
              class="location-link"
              aria-label="Hotel location"
              @click="openMap"
            >
              📍 {{ hotel.location }}
            </p>

            <div class="hero-price">
              <p class="price">
                From RM
                {{
                  hotel.rooms?.[0]?.price ||
                  hotel.price
                }} /night
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- BODY -->
      <section class="container">
        <div class="layout">
          <!-- LEFT -->
          <div class="left-column">
            <!-- ABOUT -->
            <section
              class="card"
              aria-labelledby="aboutHotel"
            >
              <h2 id="aboutHotel">
                About This Hotel
              </h2>

              <p class="desc">
                {{ hotel.description || 'No description available.' }}
              </p>

              <!-- FEATURES -->
              <div
                class="features"
                v-if="hotel.features && hotel.features.length"
                aria-label="Hotel features"
              >
                <div
                  class="feature"
                  v-for="(feature, index) in hotel.features"
                  :key="index"
                >
                  ✔ {{ feature }}
                </div>
              </div>
            </section>

            <!-- ROOM TYPES -->
            <section
              class="card"
              v-if="hotel.rooms && hotel.rooms.length"
              aria-labelledby="roomSection"
            >
              <div class="room-header">
                <h2 id="roomSection">
                  Available Room Types
                </h2>

                <span>
                  {{ hotel.rooms.length }} Rooms
                </span>
              </div>

              <!-- Room Gallery -->
              <div class="room-grid">
                <div
                  v-for="(room, index) in hotel.rooms"
                  :key="index"
                  class="room-card"
                  :class="{
                    active: selectedRoomIndex === index
                  }"
                  @click="selectRoom(index)"
                  @keydown.enter="selectRoom(index)"
                  @keydown.space.prevent="selectRoom(index)"
                  tabindex="0"
                  role="button"
                  :aria-label="'Select ' + room.type + ' room'"
                >
                  <img
                    :src="room.image"
                    :alt="room.type + ' room image'"
                  />

                  <div class="room-info">
                    <h3>{{ room.type }}</h3>

                    <p>
                      {{ room.description }}
                    </p>

                    <div class="room-bottom">
                      <span class="room-price">
                        RM {{ room.price }} /night
                      </span>

                      <button
                        type="button"
                        :aria-label="'Select ' + room.type"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- RIGHT -->
          <aside
            class="right-column"
            aria-label="Booking summary"
          >
            <div class="booking-card">
              <h3>Booking Summary</h3>

              <div class="summary-box">
                <p class="label">Hotel</p>
                <p>{{ hotel.name }}</p>

                <template v-if="selectedRoom">
                  <p class="label">Room Type</p>
                  <p>{{ selectedRoom.type }}</p>

                  <p class="label">Price</p>
                  <p class="highlight">
                    RM {{ selectedRoom.price }} /night
                  </p>
                </template>

                <template v-else>
                  <p class="muted">
                    Please select a room.
                  </p>
                </template>
              </div>

              <router-link
                v-if="selectedRoom"
                :to="{
                  path: '/booking/' + hotel.id,
                  query: {
                    room: selectedRoom.type,
                    price: selectedRoom.price
                  }
                }"
              >
                <button
                  class="book-btn"
                  aria-label="Book selected room"
                >
                  Book Selected Room
                </button>
              </router-link>

              <router-link to="/hotels">
                <button
                  class="back-btn"
                  aria-label="Back to hotels page"
                >
                  Back to Hotels
                </button>
              </router-link>
            </div>
          </aside>
        </div>
      </section>
    </main>

        <!-- Error -->
    <div
      v-else
      class="loading-section"
      role="alert"
    >
      Hotel not found.
    </div>

    <!-- MAP POPUP -->
    <div
      v-if="showMap"
      class="map-modal"
      @click.self="closeMap"
    >
      <div class="map-content">
        <button
          class="close-map"
          @click="closeMap"
          aria-label="Close map"
        >
          ✕
        </button>

        <h2>{{ hotel.name }} Location</h2>

        <iframe
          :src="mapUrl"
          width="100%"
          height="450"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()

const hotel = ref(null)
const loading = ref(true)

const selectedRoomIndex = ref(0)

/* MAP */
const showMap = ref(false)

const openMap = () => {
  showMap.value = true
}

const closeMap = () => {
  showMap.value = false
}

const mapUrl = computed(() => {
  if (!hotel.value?.location) return ''

  return `https://maps.google.com/maps?q=${encodeURIComponent(
    hotel.value.location
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
})

onMounted(async () => {
  try {
    const res = await api.get(
      '/hotels/' + route.params.id
    )

    hotel.value = res.data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})

const selectRoom = (index) => {
  selectedRoomIndex.value = index
}

const selectedRoom = computed(() => {
  if (
    hotel.value &&
    hotel.value.rooms &&
    hotel.value.rooms.length
  ) {
    return hotel.value.rooms[
      selectedRoomIndex.value
    ]
  }

  return null
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: #f0f9ff;
  display: flex;
  flex-direction: column;
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

/* LOADING */
.loading-section {
  min-height: 100vh;
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6b7280;
}

.loader {
  width: 46px;
  height: 46px;
  border: 4px solid #dbeafe;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* HERO */
.hero {
  position: relative;
  height: 520px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: end;
}

.hero-content {
  color: white;
  width: 100%;
  padding: 60px 8%;
}

.tag {
  background: #2563eb;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}

.hero h1 {
  font-size: 56px;
  margin: 18px 0 10px;
}

.hero p {
  font-size: 18px;
}

.hero-price {
  margin-top: 18px;
  font-size: 28px;
  font-weight: bold;
}

/* LOCATION LINK */
.location-link {
  cursor: pointer;
  display: inline-block;
  transition: .2s;
}

.location-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}

/* BODY */
.container {
  max-width: 1300px;
  margin: auto;
  padding: 60px 8%;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 28px;
}

/* CARD */
.card,
.booking-card {
  background: white;
  border-radius: 22px;
  padding: 30px;
  box-shadow: 0 12px 28px rgba(0,0,0,.07);
  margin-bottom: 28px;
}

.card h2 {
  margin-bottom: 18px;
}

.desc {
  color: #6b7280;
  line-height: 1.8;
  margin-bottom: 26px;
}

/* FEATURES */
.features {
  display: grid;
  grid-template-columns:
    repeat(auto-fit,minmax(180px,1fr));
  gap: 14px;
}

.feature {
  background: #dae7f9;
  padding: 14px;
  border-radius: 12px;
  color: #2563eb;
  font-weight: 600;
}

/* ROOM HEADER */
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.room-header span {
  color: #6b7280;
}

/* ROOM GRID */
.room-grid {
  display: grid;
  gap: 22px;
}

.room-card {
  border: 2px solid #eef2f7;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: .25s;
}

.room-card:hover,
.room-card:focus {
  transform: translateY(-4px);
  outline: 3px solid #2563eb;
}

.room-card.active {
  border-color: #2563eb;
  box-shadow: 0 10px 24px rgba(37,99,235,.12);
}

.room-card img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.room-info {
  padding: 20px;
}

.room-info h3 {
  margin-bottom: 10px;
  font-size: 24px;
}

.room-info p {
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 16px;
}

.room-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-price {
  font-size: 24px;
  color: #2563eb;
  font-weight: bold;
}

.room-bottom button {
  padding: 10px 16px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.room-bottom button:focus,
.book-btn:focus,
.back-btn:focus {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

/* BOOKING */
.card,
.booking-card {
  background: white;
  border-radius: 22px;
  padding: 30px;
  box-shadow: 0 12px 28px rgba(0,0,0,.07);
  margin-bottom: 28px;
}

.right-column {
  position: relative;
}

.booking-card {
  position: sticky;
  top: 100px;
}

.booking-card h3 {
  margin-bottom: 18px;
}

.summary-box {
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.label {
  color: #6b7280;
  font-size: 14px;
  margin-top: 10px;
}

.highlight {
  font-size: 24px;
  color: #2563eb;
  font-weight: bold;
}

.muted {
  color: #9ca3af;
}

.book-btn,
.back-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 12px;
}

.book-btn {
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
}

.back-btn {
  background: #e5e7eb;
}

/* MAP MODAL */
.map-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.map-content {
  background: white;
  width: 100%;
  max-width: 850px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  padding: 24px;
  animation: popup .25s ease;
}

.map-content h2 {
  margin-bottom: 18px;
}

.close-map {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: #ef4444;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
}

.close-map:hover {
  background: #dc2626;
}

@keyframes popup {
  from {
    transform: scale(.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* RESPONSIVE */
@media (max-width: 950px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .hero {
    height: 420px;
  }

  .hero h1 {
    font-size: 42px;
  }
}

@media (max-width: 500px) {
  .hero {
    height: 340px;
  }

  .hero-content,
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero h1 {
    font-size: 30px;
  }

  .card,
  .booking-card {
    padding: 22px;
  }

  .room-card img {
    height: 220px;
  }

  .room-bottom {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .map-content {
    padding: 18px;
  }
}
</style>