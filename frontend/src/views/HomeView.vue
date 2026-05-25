<template>
  <div class="page">
    <!-- HERO -->
    <section
      class="hero"
      aria-labelledby="home-heading"
    >
      <div class="overlay">
        <div class="hero-content">
          <span class="tag">
            Trusted Hotel Booking Platform
          </span>

          <h1 id="home-heading">
            Kuching's Premier Hotel Booking Platform
          </h1>

          <p>
            Kuching, the capital of Sarawak, is often called the "City of Cats". It is a unique riverside destination known for its blend of colonial history, vibrant multiculturalism and status as a UNESCO Creative City of Gastronomy.
          </p>

          <router-link to="/hotels">
            <button
              class="hero-btn"
              aria-label="Explore available hotels"
            >
              Explore Hotels
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section
      class="features"
      aria-labelledby="features-heading"
    >
      <div class="title">
        <h2 id="features-heading">
          Why Choose Us
        </h2>

        <p>
          Easy booking experience with premium comfort.
        </p>
      </div>

      <div class="feature-grid">
        <!-- Card 1 -->
        <article class="feature-card">
          <div class="feature-inner">

            <!-- Front -->
            <div class="feature-front">
              <h3>Wide Selection</h3>
              <p>Top hotels in Kuching City</p>
            </div>

            <!-- Back -->
            <div class="feature-back">
              <h3>Wide Selection</h3>
              <p>✔ 20+ Hotels Available</p>
              <p>✔ Multiple Room Types</p>
              <p>✔ Prime Locations</p>
            </div>

          </div>
        </article>

        <!-- Card 2 -->
        <article class="feature-card">
          <div class="feature-inner">

            <!-- Front -->
            <div class="feature-front">
              <h3>Best Price</h3>
              <p>Affordable deals every season.</p>
            </div>

            <div class="feature-back">
              <h3>Best Price</h3>
              <p>✔ Seasonal Promotions</p>
              <p>✔ No Hidden Charges</p>
              <p>✔ Affordable Rates</p>
            </div>

          </div>
        </article>

        <!-- Card 3 -->
        <article class="feature-card">
          <div class="feature-inner">

            <div class="feature-front">
              <h3>Fast Booking</h3>
              <p>Reserve rooms instantly.</p>
            </div>

            <div class="feature-back">
              <h3>Fast Booking</h3>
              <p>✔ Instant Confirmation</p>
              <p>✔ Easy Booking Process</p>
              <p>✔ Available Anytime</p>
            </div>

          </div>
        </article>
      </div>
    </section>

    <!-- POPULAR HOTELS -->
    <section
      class="popular"
      aria-labelledby="popular-heading"
    >
      <div class="title">
        <h2 id="popular-heading">
          Popular Hotels
        </h2>

        <p>Our most booked hotels.</p>
      </div>

      <div
        v-if="loading"
        class="loading"
        role="status"
        aria-live="polite"
      >
        Loading hotels...
      </div>

      <div
        v-else-if="filteredHotels.length"
        class="hotel-grid"
        aria-label="Popular hotel listings"
      >
        <article
          v-for="hotel in filteredHotels"
          :key="hotel.id"
          class="hotel-card"
        >
          <div class="img-wrap">
            <img
              :src="hotel.image"
              :alt="hotel.name + ' hotel image'"
            />

            <span class="badge">
              Popular
            </span>
          </div>

          <div class="hotel-content">
            <h3>{{ hotel.name }}</h3>

            <p class="location">
              📍 {{ hotel.location }}
            </p>

            <div class="room-tags">
              <span
                v-for="room in hotel.rooms?.slice(0,2)"
                :key="room.type"
              >
                {{ room.type }}
              </span>
            </div>

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
              >
                <button
                  class="view-btn"
                  :aria-label="'View details for ' + hotel.name"
                >
                  View
                </button>
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="empty"
        role="alert"
      >
        No hotels found.
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
} from 'vue'

import api from '../services/api'

const hotels = ref([])
const loading = ref(true)

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

const filteredHotels = computed(() => {
  return hotels.value.slice(0, 3)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.page {
  background: #f0f9ff;
  min-height: 100vh;
}

/* Hero */
.hero {
  min-height: 90vh;
  background:
    linear-gradient(
      rgba(0,0,0,.55),
      rgba(0,0,0,.55)
    ),
    url("@/assets/hero/Kuchingcity.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  
}

.overlay {
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.hero-content {
  color: white;
  padding: 0 8%;
  max-width: 1200px;
  margin: auto;
}

.hero-btn {
  padding: 15px 28px;
  border: none;
  border-radius: 50px;

  background:
    linear-gradient(
      135deg,
      #3b82f6,
      #1d4ed8
    );

  color: white;
  font-weight: bold;
  font-size: 15px;

  cursor: pointer;
  transition: .35s;

  box-shadow:
    0 10px 25px rgba(37,99,235,.35);
}

.hero-btn:hover {
  transform: translateY(-4px) scale(1.03);

  box-shadow:
    0 18px 35px rgba(37,99,235,.45);
}

.tag {
  display: inline-block;
  background: rgba(255,255,255,.15);
  padding: 8px 14px;
  border-radius: 30px;
  margin-bottom: 20px;
}

/* HERO ANIMATIONS */
.tag,
.hero-content h1,
.hero-content p,
.hero-btn {
  opacity: 0;
  transform: translateY(40px);
  animation: heroFadeUp 1s ease forwards;
}

/* Different delays */
.tag {
  animation-delay: 0.2s;
}

.hero-content h1 {
  animation-delay: 0.5s;
}

.hero-content p {
  animation-delay: 0.8s;
}

.hero-btn {
  animation-delay: 1.1s;
}

h1{
  font-size: 62px;
  margin-bottom: 20px;
}

/* Main animation */
@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero p {
  max-width: 650px;
  line-height: 1.8;
  margin-bottom: 25px;
}

.hero-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

/* Sections */
.features,
.popular {
  padding: 70px 8%;
}

.title {
  text-align: center;
  margin-bottom: 35px;
}

.title h2 {
  font-size: 40px;
  margin-bottom: 10px;
}

.title p {
  color: #6b7280;
}

/* Features */
.feature-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  background: transparent;
  height: 220px;
  perspective: 1000px;
}

.feature-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform .7s;
  transform-style: preserve-3d;
}

.feature-card:hover .feature-inner {
  transform: rotateY(180deg);
}

.feature-front,
.feature-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  backface-visibility: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 28px;
  text-align: center;

  box-shadow:
    0 10px 25px rgba(0,0,0,.06);
}

/* Front */
.feature-front {
  background: white;
}

.feature-front h3 {
  margin-bottom: 12px;
}

/* Back */
.feature-back {
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );
  color: white;
  transform: rotateY(180deg);
}

.feature-back h3 {
  margin-bottom: 12px;
}

.feature-back p {
  margin: 6px 0;
}

/* Popular Hotels */
.hotel-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit,minmax(300px,1fr));
  gap: 28px;
}

.hotel-card {
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow:
    0 12px 28px rgba(0,0,0,.08);
  transition: .3s;
}

.hotel-card:hover {
  transform: translateY(-8px);
}

.img-wrap {
  position: relative;
}

.img-wrap img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #2563eb;
  color: white;
  padding: 7px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: bold;
}

.hotel-content {
  padding: 22px;
}

.hotel-content h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.location {
  color: #6b7280;
  margin-bottom: 15px;
}

.room-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.room-tags span {
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 10px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: #2563eb;
}

.view-btn {
  padding: 10px 16px;
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
  transition: .35s;

  box-shadow:
    0 10px 25px rgba(37,99,235,.35);

}

.loading,
.empty {
  text-align: center;
  padding: 50px;
}

/* Accessibility */
button:focus,
button:focus-visible,
a:focus,
a:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  h1 {
    font-size: 42px;
  }

  .title h2 {
    font-size: 32px;
  }
}

@media (max-width: 500px) {
  .hero-content,
  .features,
  .popular {
    padding-left: 20px;
    padding-right: 20px;
  }

  h1 {
    font-size: 32px;
  }

  .bottom-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .view-btn {
    width: 100%;
  }
}
</style>