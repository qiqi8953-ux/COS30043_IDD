<!-- HotelCard.vue -->
<template>
  <div
    class="card"
    role="article"
    :aria-label="hotel.name"
  >
    <img
      :src="hotel.image"
      :alt="hotel.name"
    />

    <div class="content">
      <h3>{{ hotel.name }}</h3>

      <p
        class="location"
        :aria-label="'Location: ' + hotel.location"
      >
        📍 {{ hotel.location }}
      </p>

      <p
        class="price"
        :aria-label="'Price RM ' + hotel.price + ' per night'"
      >
        RM {{ hotel.price }} / night
      </p>

      <router-link
        :to="'/hotel/' + hotel.id"
        :aria-label="'View details for ' + hotel.name"
      >
        <button>
          View Details
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hotel: Object
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,.08);
  transition: .3s;
}

.card:hover {
  transform: translateY(-8px);
}

img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.content {
  padding: 20px;
}

h3 {
  margin-bottom: 10px;
}

.location {
  color: #6b7280;
  margin-bottom: 10px;
}

.price {
  color: #2563eb;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 14px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

/* Accessibility */
button:focus,
a:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 3px;
}
</style>