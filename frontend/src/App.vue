<template>
  <div class="layout">
    <!-- Navbar -->
    <Navbar />

    <!-- Page Content -->
    <router-view />

    <!-- Footer -->
    <Footer />

    <!-- Global Cursor -->
    <div class="custom-cursor"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const moveCursor = (e) => {
  const cursor =
    document.querySelector('.custom-cursor')

  if (cursor) {
    cursor.style.left = e.clientX + 'px'
    cursor.style.top = e.clientY + 'px'
  }
}

onMounted(() => {
  window.addEventListener(
    'mousemove',
    moveCursor
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'mousemove',
    moveCursor
  )
})
</script>

<style>
* {
  box-sizing: border-box;
  cursor: none !important;
}

/* DRAGGING MODE */
body.dragging .custom-cursor {
  width: 65px;
  height: 65px;

  border-radius: 50%;

  background:
    rgba(37,99,235,.28);

  border: 3px solid white;

  box-shadow:
    0 0 30px rgba(37,99,235,.9);

  transform:
    translate(-50%, -50%) scale(.9);
}

/* Hide default cursor */
body,
button,
a,
input,
textarea {
  cursor: none !important;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* This makes footer stay at bottom */
.layout > *:nth-child(2) {
  flex: 1;
}

.custom-cursor {
  position: fixed;

  width: 20px;
  height: 20px;

  border: 2px solid #60a5fa;
  border-radius: 50%;

  background:
    rgba(96,165,250,.15);

  backdrop-filter: blur(4px);

  pointer-events: none;

  transform:
    translate(-50%, -50%);

  z-index: 99999;

  transition:
    width .2s,
    height .2s,
    background .2s,
    border .2s;

  box-shadow:
    0 0 18px rgba(96,165,250,.7);
}

/* Hover Effect */
button:hover ~ .custom-cursor,
a:hover ~ .custom-cursor {
  width: 42px;
  height: 42px;

  background:
    rgba(37,99,235,.25);

  border-color: white;
}
</style>