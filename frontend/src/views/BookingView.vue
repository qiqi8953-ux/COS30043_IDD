<!-- Booking.vue -->
<template>
  <div class="page">

    <!-- Hero -->
    <section
      class="hero"
      aria-labelledby="booking-heading"
    >
      <div class="hero-content">

        <h1 id="booking-heading">
          Book Your Stay
        </h1>

        <p>
          Complete your reservation in a few simple steps.
        </p>

      </div>
    </section>

    <main class="container">

      <!-- LOADING -->
      <div
        v-if="loading"
        class="loading"
        role="status"
        aria-live="polite"
      >
        Loading booking details...
      </div>

      <!-- CONTENT -->
      <div
        v-else
        class="booking-card"
      >

        <!-- LEFT -->
        <section
          class="left-panel"
          aria-labelledby="hotel-summary"
        >

          <!-- ROOM IMAGE -->
          <img
            :src="roomImage"
            class="preview-img"
            :alt="roomType + ' room at ' + hotelName"
            @click="openViewer(roomImage)"
          />

          <!-- 360 ROOM VIEW (opens in modal on click) -->
          <div class="viewer-wrapper">
            <div class="guide">
              Click image to open 360 viewer
            </div>
          </div>

          <!-- MODAL 360 VIEWER -->
          <div v-if="showViewer" class="viewer-modal" @click.self="closeViewer">
            <div class="viewer-modal-content">
              <div class="guide-wrap">
                <div class="guide">Drag your mouse to explore room</div>
                <button class="viewer-close" @click="closeViewer" aria-label="Close viewer">×</button>
              </div>
              <div class="viewer-canvas-wrapper">
                <canvas ref="canvas" @click.stop  :class="{ dragging: isDraggingState }"></canvas>
                <img v-show="textureError || !textureLoaded" :src="roomImage" alt="room preview" class="viewer-fallback-img" />
              </div>
            </div>
          </div>

          <h2 id="hotel-summary">
            {{ hotelName }}
          </h2>

          <p class="room-type">
            {{ roomType }}
          </p>

          <h3>
            RM {{ roomPrice }}
          </h3>

        </section>

        <!-- RIGHT -->
        <section
          class="right-panel"
          aria-labelledby="booking-form-heading"
        >

          <h2 id="booking-form-heading">
            Booking Form
          </h2>

          <form @submit.prevent="bookHotel">

            <!-- NAME -->
            <div class="input-group">

              <label for="fullname">
                Full Name
              </label>

              <input
                id="fullname"
                v-model="customerName"
                type="text"
                required
              />

            </div>

            <!-- CHECK IN -->
            <div class="input-group">

              <label for="checkin">
                Check-in Date
              </label>

              <input
                id="checkin"
                type="date"
                v-model="date"
                required
              />

            </div>

            <!-- CHECK OUT -->
            <div class="input-group">

              <label for="checkout">
                Check-out Date
              </label>

              <input
                id="checkout"
                type="date"
                v-model="checkoutDate"
                required
              />

            </div>

            <!-- SUMMARY -->
            <div class="summary-box">

              <p>
                <strong>Hotel:</strong>
                {{ hotelName }}
              </p>

              <p>
                <strong>Room:</strong>
                {{ roomType }}
              </p>

              <p>
                <strong>Price:</strong>
                RM {{ roomPrice }} /night
              </p>

              <p>
                <strong>Nights:</strong>
                {{ nights }}
              </p>

              <p>
                <strong>Total:</strong>
                RM {{ totalPrice }}
              </p>

            </div>

            <!-- BUTTON -->
            <button
              class="book-btn"
              type="submit"
            >
              Confirm Booking
            </button>

          </form>

          <!-- SUCCESS -->
          <p
            class="success"
            v-if="successMessage"
          >
            {{ successMessage }}
          </p>

          <!-- ERROR -->
          <p
            class="error"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </p>

        </section>

      </div>

    </main>

  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  nextTick
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import api from '../services/api'
import Swal from 'sweetalert2'
import * as THREE from 'three'

const route = useRoute()
const router = useRouter()

const loading = ref(true)

const customerName = ref('')
const date = ref('')
const checkoutDate = ref('')

const successMessage = ref('')
const errorMessage = ref('')

const hotelName = ref('')
const roomType = ref('')
const roomPrice = ref(0)
const roomImage = ref('')

/* =========================
   360 VIEWER
========================= */

const canvas = ref(null)
const showViewer = ref(false)

const viewerImgUrl = ref('')
const textureLoaded = ref(false)
const textureError = ref(false)
const isDraggingState = ref(false)

let sphere = null
let animId = null
let viewerInitialized = false

let scene
let camera
let renderer

let isDragging = false
let previousMouseX = 0
let previousMouseY = 0

const handleResize = () => {
  if (!canvas.value || !renderer || !camera) return
  
  const width = canvas.value.clientWidth || canvas.value.getBoundingClientRect().width || 300
  const height = 300 
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height, false)
}

const init360Viewer = (imageUrl) => {
  // Read accurate width dimension setup from DOM layout
  const width = canvas.value?.clientWidth || canvas.value?.getBoundingClientRect().width || 600
  const height = 300 

  // SCENE
  scene = new THREE.Scene()

  // CAMERA
  camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1100)
  camera.position.set(0, 0, 0.01)
  camera.updateProjectionMatrix()

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height, false)
  renderer.setClearColor(0x000000, 0)

// SPHERE
const geometry = new THREE.SphereGeometry(500, 60, 40)
geometry.scale(-1, 1, 1)

// TEXTURE LOADER
const loader = new THREE.TextureLoader()

loader.load(
  imageUrl || roomImage.value,

  (texture) => {

    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })

    sphere = new THREE.Mesh(geometry, material)

    scene.add(sphere)

    textureLoaded.value = true
    textureError.value = false
  },

  undefined,

  (err) => {
    console.error('Failed to load 360 texture', err)
    textureLoaded.value = false
    textureError.value = true
  }
)

  // --- DESKTOP MOUSE CONTROLS ---
  if (!viewerInitialized) {
    canvas.value.addEventListener('mousedown', (event) => {
      isDragging = true
      isDraggingState.value = true

      document.body.classList.add('dragging')
      
      previousMouseX = event.clientX
      previousMouseY = event.clientY
    })

    window.addEventListener('mouseup', () => {
      isDragging = false
      isDraggingState.value = false
      document.body.classList.remove('dragging')
    })

    window.addEventListener('mousemove', (event) => {
      if (!isDragging) return
      const movementX = event.clientX - previousMouseX
      const movementY = event.clientY - previousMouseY
      camera.rotation.y += movementX * 0.003
      camera.rotation.x += movementY * 0.003
      previousMouseX = event.clientX
      previousMouseY = event.clientY
    })

    // --- MOBILE TOUCH CONTROLS ---
    canvas.value.addEventListener('touchstart', (event) => {
      isDragging = true

      document.body.classList.add('dragging')
      
      previousMouseX = event.touches[0].clientX
      previousMouseY = event.touches[0].clientY
    }, { passive: true })

    window.addEventListener('touchend', () => {
      isDragging = false
      document.body.classList.remove('dragging')
    })

    window.addEventListener('touchmove', (event) => {
      if (!isDragging) return
      const touchX = event.touches[0].clientX
      const touchY = event.touches[0].clientY
      const movementX = touchX - previousMouseX
      const movementY = touchY - previousMouseY
      camera.rotation.y += movementX * 0.005
      camera.rotation.x += movementY * 0.005
      previousMouseX = touchX
      previousMouseY = touchY
    }, { passive: true })

    window.addEventListener('resize', handleResize)

    viewerInitialized = true
  }

  animate360()
}

const animate360 = () => {
  animId = requestAnimationFrame(animate360)
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const updateViewerTexture = (imageUrl) => {
  if (!sphere) return
  const loader = new THREE.TextureLoader()
  loader.load(imageUrl, (tex) => {
    sphere.material.map = tex
    sphere.material.needsUpdate = true
    textureLoaded.value = true
    textureError.value = false
  }, undefined, (err) => {
    console.error('Failed to update texture', err)
    textureLoaded.value = false
    textureError.value = true
  })
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (animId) cancelAnimationFrame(animId)
  if (renderer) {
    try { renderer.dispose() } catch (e) { /* ignore */ }
  }
  viewerInitialized = false
})

const openViewer = async (imageUrl) => {
  showViewer.value = true
  viewerImgUrl.value = imageUrl || roomImage.value
  textureLoaded.value = false
  textureError.value = false

  // 1. Wait for Vue to append the DOM elements
  await nextTick()

  // 2. Microtask browser block to ensure the CSS modal structure completes rendering layout
  if (!canvas.value || canvas.value.clientWidth === 0) {
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }

  if (!viewerInitialized || !renderer) {
    init360Viewer(imageUrl || roomImage.value)
  } else {
    if (camera) {
      camera.rotation.set(0, 0, 0)
    }
    updateViewerTexture(imageUrl || roomImage.value)
    handleResize() // Force updates aspect configuration parameters
    if (!animId) animate360()
  }
}

const closeViewer = () => {
  showViewer.value = false

  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }

  // CLEAN UP
  if (renderer) {
    renderer.dispose()
    renderer = null
  }

  scene = null
  camera = null
  sphere = null

  viewerInitialized = false
}

/* =========================
   BOOKING
========================= */

const nights = computed(() => {
  if (!date.value || !checkoutDate.value) {
    return 0
  }

  const checkIn = new Date(date.value)
  const checkOut = new Date(checkoutDate.value)
  const diff = checkOut - checkIn

  return diff > 0
    ? Math.ceil(diff / (1000 * 60 * 60 * 24))
    : 0
})

const totalPrice = computed(() => {
  return nights.value * roomPrice.value
})

onMounted(async () => {
  try {
    const hotelId = route.params.id
    const selectedRoomType = route.query.room
    const selectedRoomPrice = route.query.price

    const res = await api.get('/hotels/' + hotelId)
    const hotel = res.data

    if (!hotel) {
      errorMessage.value = 'Hotel not found.'
      return
    }

    hotelName.value = hotel.name

    const selectedRoom = hotel.rooms.find(
      room => room.type === selectedRoomType && room.price === parseInt(selectedRoomPrice)
    )

    if (!selectedRoom) {
      errorMessage.value = 'Selected room not found.'
      return
    }

    roomType.value = selectedRoom.type
    roomPrice.value = selectedRoom.price
    roomImage.value = selectedRoom.image

  } catch (error) {
    console.log(error)
    errorMessage.value = 'Failed to load booking details.'
  } finally {
    loading.value = false
  }
})

const bookHotel = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please login first!',
        confirmButtonColor: '#dc2626'
      })
      router.push('/login')
      return
    }

    if (nights.value <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Check-out must be after check-in.'
      })
      return
    }

    await api.post('/bookings', {
      user: user.email,
      hotelId: route.params.id,
      customerName: customerName.value,
      hotelName: hotelName.value,
      roomType: roomType.value,
      roomPrice: roomPrice.value,
      totalPrice: totalPrice.value,
      nights: nights.value,
      roomImage: roomImage.value,
      date: date.value,
      checkoutDate: checkoutDate.value
    })

    Swal.fire({
      icon: 'success',
      title: 'Booking Successful!',
      text: 'Your hotel has been booked successfully.',
      confirmButtonColor: '#2563eb'
    })
    router.push('/history')

  } catch (error) {
    console.log(error)
    Swal.fire({
      icon: 'error',
      title: 'Booking Failed',
      text: 'Failed to book the hotel.',
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
  background: #f0f9ff;
  min-height: 100vh;
}

/* HERO */
.hero {
  height: 260px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: auto;
  width: 100%;
  padding: 0 8%;
}

.hero h1 {
  font-size: 42px;
  margin-bottom: 10px;
}

/* CONTAINER */
.container {
  max-width: 1100px;
  margin: auto;
  padding: 50px 8%;
}

/* LOADING */
.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #6b7280;
}

/* CARD */
.booking-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 15px 35px rgba(0,0,0,.08);
}

/* LEFT */
.left-panel {
  background: rgb(214, 237, 255);
  padding: 35px;
}

.preview-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 20px;
  cursor: pointer;
}

/* 360 VIEW */
.viewer-wrapper {
  margin-top: 20px;
}

/* MODAL VIEWER */
.viewer-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11000;
  padding: 20px;
}
.viewer-modal-content {
  width: 100%;
  max-width: 1000px;
  border-radius: 18px;
  overflow: hidden;
  background: transparent;
  position: relative;
}
.guide-wrap {
  position: relative;
  display: block;
}
.viewer-close {
  position: absolute;
  right: 10px;
  top: 3px;
  z-index: 9999;
  background: rgba(255,255,255,0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}
.guide { margin-bottom: 12px; }

.viewer-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 18px;
}

.viewer-canvas-wrapper canvas,
.viewer-canvas-wrapper .viewer-fallback-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.viewer-canvas-wrapper canvas {
  z-index: 2;
  background: transparent;
  touch-action: none;
  cursor: grab;
}

.viewer-canvas-wrapper canvas.dragging {
  cursor: grabbing;
}

.viewer-canvas-wrapper .viewer-fallback-img {
  z-index: 1;
  object-fit: cover;
}

.guide {
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 12px;
  background: white;
  color: #2563eb;
  font-weight: bold;
  text-align: center;
}

/* TEXT */
.left-panel h2 {
  margin-top: 25px;
  margin-bottom: 10px;
}

.room-type {
  color: #6b7280;
  margin-bottom: 12px;
  font-size: 18px;
}

.left-panel h3 {
  color: #2563eb;
  font-size: 30px;
}

/* RIGHT */
.right-panel {
  padding: 35px;
}

.right-panel h2 {
  margin-bottom: 25px;
}

/* FORM */
.input-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
}

input:focus,
button:focus {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* SUMMARY */
.summary-box {
  background: #f8fafc;
  padding: 18px;
  border-radius: 14px;
  margin-bottom: 20px;
}

.summary-box p {
  margin-bottom: 8px;
}

/* BUTTON */
.book-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: .3s;
}

.book-btn:hover {
  background: #1d4ed8;
}

/* STATUS */
.success {
  margin-top: 18px;
  color: green;
  font-weight: bold;
}

.error {
  margin-top: 18px;
  color: red;
  font-weight: bold;
}

/* MOBILE */
@media (max-width: 900px) {
  .booking-card {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 32px;
  }

  canvas {
    height: 220px; 
  }
}
</style>