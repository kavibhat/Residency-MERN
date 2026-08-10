import { useState } from 'react'
import './index.css'

const rooms = [
  { id:1, name:'Deluxe Room',       icon:'🛏️', cls:'r1', desc:'Spacious room with city view, king-size bed and premium amenities.', features:['King Bed','City View','Free WiFi','AC'], price:'3,999' },
  { id:2, name:'Premium Suite',     icon:'🌹', cls:'r2', desc:'Luxurious suite with jacuzzi, separate living area and panoramic views.', features:['Jacuzzi','Living Room','Mini Bar','Butler'], price:'7,999' },
  { id:3, name:'Presidential Suite',icon:'👑', cls:'r3', desc:'Private terrace, butler service and breathtaking city views.', features:['Private Terrace','Butler 24/7','Dining Room','Spa'], price:'14,999' }
]

function App() {
  const [form, setForm]           = useState({ guestName:'', email:'', phone:'', roomType:'Deluxe Room', checkIn:'', checkOut:'', guests:'1 Guest', requests:'' })
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState('')
  const [error, setError]         = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

  const selectRoom = name => {
    setForm(f => ({ ...f, roomType: name }))
    scrollTo('booking')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.guestName || !form.email || !form.phone || !form.checkIn || !form.checkOut) {
      setError('Please fill in all required fields!')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNotification(`✅ Booking confirmed! Your ID: ${data.bookingId}`)
      setTimeout(() => setNotification(''), 5000)
      setForm({ guestName:'', email:'', phone:'', roomType:'Deluxe Room', checkIn:'', checkOut:'', guests:'1 Guest', requests:'' })
    } catch (err) {
      setError('Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      {notification && <div className="notification">{notification}</div>}

      {/* NAVBAR */}
      <nav>
        <div className="logo">🏨 Grand Residency</div>
        <div className="nav-links">
          <a href="#rooms">Rooms</a>
          <a href="#booking">Book Now</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <h1>Welcome to <span>The Grand Residency</span></h1>
        <p>Experience luxury, comfort and world-class hospitality in Thanjavur</p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => scrollTo('booking')}>Book Your Stay</button>
          <button className="btn-outline" onClick={() => scrollTo('rooms')}>Explore Rooms</button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat"><h3>250+</h3><p>Luxury Rooms</p></div>
        <div className="stat"><h3>15+</h3><p>Years of Excellence</p></div>
        <div className="stat"><h3>4.9★</h3><p>Guest Rating</p></div>
        <div className="stat"><h3>50k+</h3><p>Happy Guests</p></div>
      </div>

      {/* ROOMS */}
      <section id="rooms">
        <div className="section-title">
          <h2>Our Rooms & Suites</h2>
          <p>Choose from our carefully designed rooms</p>
          <div className="underline"></div>
        </div>
        <div className="rooms-grid">
          {rooms.map(room => (
            <div className="room-card" key={room.id}>
              <div className={`room-img ${room.cls}`}>{room.icon}</div>
              <div className="room-info">
                <h3>{room.name}</h3>
                <p>{room.desc}</p>
                <div className="room-features">
                  {room.features.map(f => <span className="room-feature" key={f}>{f}</span>)}
                </div>
                <div className="room-footer">
                  <div className="price">₹{room.price} <span>/ night</span></div>
                  <button className="btn-sm" onClick={() => selectRoom(room.name)}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="booking" className="booking">
        <div className="section-title">
          <h2>Book Your Stay</h2>
          <p>Reserve your room — data saved to MongoDB</p>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="guestName" value={form.guestName} onChange={handleChange} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select name="roomType" value={form.roomType} onChange={handleChange}>
                <option>Deluxe Room</option>
                <option>Premium Suite</option>
                <option>Presidential Suite</option>
              </select>
            </div>
            <div className="form-group">
              <label>Check-In *</label>
              <input name="checkIn" type="date" min={today} value={form.checkIn} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Check-Out *</label>
              <input name="checkOut" type="date" min={form.checkIn||today} value={form.checkOut} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Guests</label>
              <select name="guests" value={form.guests} onChange={handleChange}>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
              </select>
            </div>
            <div className="form-group">
              <label>Special Requests</label>
              <input name="requests" value={form.requests} onChange={handleChange} placeholder="Any special requests?" />
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="form-submit">
            <button className="btn-gold" type="submit" disabled={submitting} style={{fontSize:'16px',padding:'16px 48px'}}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-title">
          <h2>Contact Us</h2>
          <p>We are here to help 24/7</p>
          <div className="underline"></div>
        </div>
        <div style={{textAlign:'center',color:'#666',lineHeight:'2'}}>
          <p>📍 123 Grand Avenue, Thanjavur, Tamil Nadu 613001</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ info@grandresidency.com</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 <span>The Grand Residency Hotel</span>. Deployed with Docker + MongoDB by <span>Bharathy K</span></p>
      </footer>
    </>
  )
}

export default App
