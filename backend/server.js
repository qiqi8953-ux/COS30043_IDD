const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())

// Serve images
app.use('/hotels', express.static(path.join(__dirname, 'public/hotels')))

const dbPath = path.join(__dirname, 'db.json')

// =====================
// READ DB
// =====================
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return {
      users: [],
      bookings: [],
      hotels: []
    }
  }

  return JSON.parse(fs.readFileSync(dbPath, 'utf8'))
}

// =====================
// WRITE DB
// =====================
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

// =====================
// HOTELS
// =====================
app.get('/api/hotels', (req, res) => {
  const db = readDB()
  res.json(db.hotels)
})

app.get('/api/hotels/:id', (req, res) => {
  const db = readDB()

  const hotel = db.hotels.find(
    h => h.id == req.params.id
  )

  if (!hotel) {
    return res.status(404).json({
      message: 'Hotel not found'
    })
  }

  res.json(hotel)
})

// =====================
// REGISTER
// =====================
app.post('/api/register', (req, res) => {
  const db = readDB()

  const existingUser = db.users.find(
    u => u.email === req.body.email
  )

  if (existingUser) {
    return res.status(400).json({
      message: 'Email already registered'
    })
  }

  db.users.push(req.body)

  writeDB(db)

  res.json({
    message: 'Registered successfully'
  })
})

// =====================
// LOGIN
// =====================
app.post('/api/login', (req, res) => {
  const db = readDB()

  const user = db.users.find(
    u =>
      u.email === req.body.email &&
      u.password === req.body.password
  )

  if (user) {
    res.json(user)
  } else {
    res.status(401).json({
      message: 'Invalid login'
    })
  }
})

// =====================
// CHANGE PASSWORD 
// =====================
app.put('/api/users/:email/password', (req, res) => {
  const db = readDB()

  const email = req.params.email
  const { currentPassword, newPassword } = req.body

  const user = db.users.find(u => u.email === email)

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  if (user.password !== currentPassword) {
    return res.status(400).json({
      message: 'Current password is incorrect'
    })
  }

  user.password = newPassword

  writeDB(db)

  res.json({
    message: 'Password updated successfully'
  })
})

// =====================
// UPDATE EMAIL ADDRESS
// =====================
app.put('/api/users/:email/email', (req, res) => {
  const db = readDB()

  const currentEmail = req.params.email
  const { newEmail } = req.body

  // Email validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(newEmail)) {
    return res.status(400).json({
      message: 'Invalid email format'
    })
  }

  // Find current user
  const user = db.users.find(
    u => u.email === currentEmail
  )

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  // Prevent same email
  if (currentEmail === newEmail) {
    return res.status(400).json({
      message:
        'New email cannot be the same as current email'
    })
  }

  // Check if new email already exists
  const existingUser = db.users.find(
    u => u.email === newEmail
  )

  if (existingUser) {
    return res.status(400).json({
      message: 'Email already registered'
    })
  }

  // Update email
  user.email = newEmail

  // OPTIONAL:
  // Update all bookings linked to old email
  db.bookings.forEach(booking => {
    if (booking.user === currentEmail) {
      booking.user = newEmail
    }
  })

  writeDB(db)

  res.json({
    message: 'Email updated successfully',
    user
  })
})

// =====================
// UPDATE PHONE NUMBER
// =====================
app.put('/api/users/:email/phone', (req, res) => {
  const db = readDB()

  const email = req.params.email
  const { phone } = req.body

  const user = db.users.find(
    u => u.email === email
  )

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  if (!/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({
      message: 'Invalid phone number format'
    })
  }

  user.phone = phone

  writeDB(db)

  res.json({
    message: 'Phone number updated successfully',
    user
  })
})

// =====================
// BOOKING
// =====================
app.post('/api/bookings', (req, res) => {
  const db = readDB()

  const newBooking = {
    user: req.body.user,
    hotelId: req.body.hotelId,
    customerName: req.body.customerName,
    hotelName: req.body.hotelName,
    roomType: req.body.roomType,
    roomImage: req.body.roomImage,
    roomPrice: req.body.roomPrice,
    totalPrice: req.body.totalPrice, // ✅
    nights: req.body.nights,  
    date: req.body.date,
    checkoutDate: req.body.checkoutDate
  }

  db.bookings.push(newBooking)

  writeDB(db)

  res.json({
    message: 'Booking successful'
  })
})

// =====================
// GET BOOKINGS
// =====================
app.get('/api/bookings', (req, res) => {
  const db = readDB()
  res.json(db.bookings)
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend is running'
  })
})

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})