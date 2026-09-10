import { useEffect, useState } from "react";
import { amenityApi } from "../api/amenityApi";
import { bookingApi } from "../api/bookingApi";
import "./AmenityDashboard.css";

const SOCIETY_ID = 1;     // hardcoded until Sprint 6 auth
const CURRENT_USER_ID = 1; // hardcoded until Sprint 6 auth

function formatTime(t) {
  return t.slice(0, 5); // "10:00:00" -> "10:00"
}

export default function AmenityDashboard() {
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenityId, setSelectedAmenityId] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    amenityApi.getAll(SOCIETY_ID).then((data) => {
      setAmenities(data);
      if (data.length > 0) setSelectedAmenityId(data[0].id);
    });
    loadMyBookings();
  }, []);

  useEffect(() => {
    if (!selectedAmenityId) return;
    loadSlots();
  }, [selectedAmenityId, date]);

  async function loadSlots() {
    setLoadingSlots(true);
    setMessage(null);
    try {
      const data = await amenityApi.getAvailability(selectedAmenityId, date);
      setSlots(data);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleSlotClick(slot) {
    if (!slot.available) return;

    const isSameSlot = selectedSlot?.startTime === slot.startTime;
    setSelectedSlot(isSameSlot ? null : slot);
    setMessage(null);
  }

  async function loadMyBookings() {
    const data = await bookingApi.getMyBookings(CURRENT_USER_ID);
    setMyBookings(data.filter((b) => b.status !== "CANCELLED"));
  }

  async function handleConfirmBooking() {
    if (!selectedSlot) return;

    setConfirming(true);
    setMessage(null);

    try {
      await bookingApi.create({
        amenityId: selectedAmenityId,
        bookedByUserId: CURRENT_USER_ID,
        bookingDate: date,
        startTime: selectedSlot.startTime,
      });
      setMessage({
        type: "success",
        text: `Booked ${formatTime(selectedSlot.startTime)} \u2013 ${formatTime(selectedSlot.endTime)}`,
      });
      setSelectedSlot(null);
      await loadSlots();
      await loadMyBookings();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      setSelectedSlot(null);
      await loadSlots();
    } finally {
      setConfirming(false);
    }
  }

  async function handleCancelBooking(bookingId) {
    await bookingApi.cancel(bookingId);
    await loadMyBookings();
    await loadSlots(); // the cancelled slot should now show as available again
  }
  const selectedAmenity = amenities.find((a) => a.id === selectedAmenityId);

  return (
    <div className="amenity-dash">
      <header className="amenity-header">
        <div>
          <p className="amenity-eyebrow">Sprint 3 · Module 02</p>
          <h1 className="amenity-title">Amenities</h1>
        </div>
      </header>

      <div className="amenity-controls">
        <select
          value={selectedAmenityId ?? ""}
          onChange={(e) => setSelectedAmenityId(Number(e.target.value))}
        >
          {amenities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {selectedAmenity && (
        <p className="amenity-meta">
          Capacity {selectedAmenity.capacity} . {formatTime(selectedAmenity.openingTime)}-{formatTime(selectedAmenity.closingTime)} . {selectedAmenity.slotDurationMins}-min slots
        </p>
      )}

      {message && (
        <div className={`amenity-message amenity-message-${message.type}`}>
          {message.text}
        </div>
      )}

      {loadingSlots ? (
        <p className="amenity-loading">Loading slots\u2026</p>
      ) : (
        <div className="slot-grid">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.startTime === slot.startTime;
            return (
              <button
                key={slot.startTime}
                className={`slot ${slot.available ? "slot-open" : "slot-taken"} ${isSelected ? "slot-selected" : ""}`}
                disabled={!slot.available}
                onClick={() => handleSlotClick(slot)}
              >
                {formatTime(slot.startTime)}
              </button>
            );
          })}
        </div>

      )}
      {selectedSlot && (
        <div className="confirm-bar">
          <span>
            Selected: <strong>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</strong>
          </span>
          <div className="confirm-bar-actions">
            <button
              className="btn-cancel-select"
              onClick={() => setSelectedSlot(null)}
              disabled={confirming}
            >
              Cancel
            </button>
            <button
              className="btn-confirm-booking"
              onClick={handleConfirmBooking}
              disabled={confirming}
            >
              {confirming ? "Confirming\u2026" : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
      <div className="my-bookings">
        <h3 className="my-bookings-title">My Bookings</h3>

        {myBookings.length === 0 ? (
          <p className="my-bookings-empty">No upcoming bookings yet.</p>
        ) : (
          <ul className="my-bookings-list">
            {myBookings.map((b) => (
              <li key={b.id} className="my-booking-item">
                <div>
                  <strong>{b.amenity.name}</strong>
                  <span className="my-booking-meta">
                    {b.bookingDate} . {formatTime(b.startTime)}-{formatTime(b.endTime)}
                  </span>
                </div>
                <button
                  className="btn-cancel-booking"
                  onClick={() => handleCancelBooking(b.id)}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}