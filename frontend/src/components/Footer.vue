<template>
  <footer
    class="footer"
    role="contentinfo"
    aria-label="Website Footer"
  >
    <div class="footer-content">
      <!-- LEFT -->
      <div class="footer-left">
        <h2>StayCatCity</h2>

        <p>
          Your trusted platform for booking the best hotels in Kuching.
        </p>
      </div>

      <!-- CENTER -->
      <nav
        class="footer-links"
        aria-label="Quick Links Navigation"
      >
        <h3>Quick Links</h3>

        <router-link
          to="/"
          aria-label="Go to Home page"
        >
          Home
        </router-link>

        <router-link
          to="/hotels"
          aria-label="Go to Hotels page"
        >
          Hotels
        </router-link>

        <router-link
          to="/history"
          aria-label="Go to History page"
        >
          History
        </router-link>
      </nav>

      <!-- RIGHT -->
      <div
        class="footer-contact"
        aria-label="Contact Information"
      >
        <h3>Contact</h3>

        <p>
          Email:
          <a
            href="mailto:support@catcitybooking.com"
            aria-label="Send email to support"
          >
            support@catcitybooking.com
          </a>
        </p>

        <p>
          Phone:
          <a
            href="tel:+60123456789"
            aria-label="Call support phone number"
          >
            +60 12-345 6789
          </a>
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 StayCatCity. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #111827;
  color: #e5e7eb;
  margin-top: auto;
}

/* MAIN */
.footer-content {
  max-width: 1200px;
  margin: auto;
  padding: 50px 8%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
  gap: 30px;
}

/* LEFT */
.footer-left h2 {
  color: white;
  margin-bottom: 10px;
}

.footer-left p {
  color: #9ca3af;
  line-height: 1.6;
}

/* LINKS */
.footer-links h3,
.footer-contact h3 {
  margin-bottom: 12px;
  color: white;
}

.footer-links a {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  margin-bottom: 8px;
}

.footer-links a:hover,
.footer-links a:focus {
  color: white;
}

/* CONTACT */
.footer-contact p {
  color: #9ca3af;
  margin-bottom: 6px;
}

.footer-contact a {
  color: #9ca3af;
  text-decoration: none;
}

.footer-contact a:hover,
.footer-contact a:focus {
  color: white;
}

/* Accessibility Focus */
a:focus,
router-link:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 3px;
  border-radius: 4px;
}

/* BOTTOM */
.footer-bottom {
  border-top: 1px solid #374151;
  text-align: center;
  padding: 15px;
  font-size: 14px;
  color: #9ca3af;
}
</style>