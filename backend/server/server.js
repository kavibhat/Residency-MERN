const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI ||
  'mongodb://mongodb:27017/hoteldb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
  guestName:  { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, required: true },
  roomType:   { type: String, required: true },
  checkIn:    { type: String, required: true },
  checkOut:   { type: String, required: true },
  guests:     { type: String, default: '1 Guest' },
  requests:   { type: String, default: '' },
  bookingId:  { type: String },
  status:     { type: String, default: 'confirmed' },
  createdAt:  { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now();
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status:    'healthy',
    service:   'grand-residency-backend',
    database:  mongoose.connection.readyState === 1
               ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      success:   true,
      bookingId: booking.bookingId,
      message:   `Booking confirmed for ${booking.guestName}`
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.id
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findOneAndDelete({ bookingId: req.params.id });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
