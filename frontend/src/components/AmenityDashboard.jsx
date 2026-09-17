import { useEffect, useState } from "react";
import { amenityApi } from "../api/amenityApi";
import { bookingApi } from "../api/bookingApi";
import "./AmenityDashboard.css";

function formatTime(t) {
  return t.slice(0, 5); // "10:00:00" -> "10:00"
}

function localDateString(now = new Date()) {
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function isPastSlot(date, startTime, now = new Date()) {
  if (date < localDateString(now)) return true;
  if (date > localDateString(now)) return false;

  // The date-time string is deliberately parsed as local time, matching the
  // date picker and the amenity's displayed opening hours.
  return new Date(`${date}T${startTime}`) <= now;
}

export default function AmenityDashboard({ currentUser }) {
  const isAdmin = currentUser.role === "ADMIN";
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenityId, setSelectedAmenityId] = useState(null);
  const [date, setDate] = useState(() => localDateString());
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [isAddAmenityOpen, setIsAddAmenityOpen] = useState(false);
  const [creatingAmenity, setCreatingAmenity] = useState(false);
  const [amenityFormMessage, setAmenityFormMessage] = useState(null);
  const [amenityForm, setAmenityForm] = useState({
    name: "",
    capacity: "",
    slotDurationMins: "60",
    openingTime: "09:00",
    closingTime: "18:00",
  });

  useEffect(() => {
    amenityApi.getAll(currentUser.societyId).then((data) => {
      setAmenities(data);
      if (data.length > 0) setSelectedAmenityId(data[0].id);
    });
    loadMyBookings();
  }, [currentUser.societyId]);

  useEffect(() => {
    if (!selectedAmenityId) return;
    setSelectedSlot(null);
    loadSlots();
  }, [selectedAmenityId, date]);

  async function loadSlots() {
    setLoadingSlots(true);
    setMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const data = await amenityApi.getAvailability(selectedAmenityId, date, controller.signal);
      setSlots(data);
    } catch (err) {
      if (err.name === "AbortError") {
        setMessage({ type: "error", text: "Request timed out. Please try again." });
      } else {
        setMessage({ type: "error", text: err.message });
      }
    } finally {
      clearTimeout(timeoutId);
      setLoadingSlots(false);
    }
  }

  function handleSlotClick(slot) {
    if (!slot.available || isPastSlot(date, slot.startTime)) return;

    const isSameSlot = selectedSlot?.startTime === slot.startTime;
    setSelectedSlot(isSameSlot ? null : slot);
    setMessage(null);
  }

  async function loadMyBookings() {
    const data = await bookingApi.getMyBookings(currentUser.employeeId, currentUser.societyId);
    setMyBookings(data.filter((b) => b.status !== "CANCELLED"));
  }

  async function handleConfirmBooking() {
    if (!selectedSlot) return;

    // Keep this guard even though the UI disables past choices: time can pass
    // after a slot was selected, or the date can be changed programmatically.
    if (isPastSlot(date, selectedSlot.startTime)) {
      setSelectedSlot(null);
      setMessage({ type: "error", text: "Past time slots cannot be booked." });
      return;
    }

    setConfirming(true);
    setMessage(null);

    try {
      await bookingApi.create({
        amenityId: selectedAmenityId,
        bookedByUserId: currentUser.employeeId,
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

  function closeAddAmenityForm() {
    setIsAddAmenityOpen(false);
    setAmenityFormMessage(null);
    setAmenityForm({ name: "", capacity: "", slotDurationMins: "60", openingTime: "09:00", closingTime: "18:00" });
  }

  function updateAmenityField(field, value) {
    setAmenityForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateAmenity(event) {
    event.preventDefault();
    if (!amenityForm.name.trim()) return;

    setCreatingAmenity(true);
    setAmenityFormMessage(null);
    try {
      const created = await amenityApi.create({
        name: amenityForm.name,
        society: { id: currentUser.societyId },
        capacity: Number(amenityForm.capacity),
        slotDurationMins: Number(amenityForm.slotDurationMins),
        openingTime: amenityForm.openingTime,
        closingTime: amenityForm.closingTime,
      });
      setAmenities((prev) => [...prev, created]);
      setSelectedAmenityId(created.id);
      closeAddAmenityForm();
    } catch (err) {
      setAmenityFormMessage({ type: "error", text: err.message });
    } finally {
      setCreatingAmenity(false);
    }
  }

  const selectedAmenity = amenities.find((a) => a.id === selectedAmenityId);

  return (
    <div className="amenity-dash">
      <header className="amenity-header">
        <div>
          <h1 className="amenity-title">Amenities</h1>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setIsAddAmenityOpen(true)}>
            Add Amenity
          </button>
        )}
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
          min={localDateString()}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setDate(selectedDate < localDateString() ? localDateString() : selectedDate);
          }}
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
        <div className="amenity-loading-wrap">
          <div className="spinner" />
          Loading slots…
        </div>
      ) : (
        <div className="slot-grid">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.startTime === slot.startTime;
            const slotIsPast = isPastSlot(date, slot.startTime);
            const canBookSlot = slot.available && !slotIsPast;
            return (
              <button
                key={slot.startTime}
                className={`slot ${canBookSlot ? "slot-open" : "slot-taken"} ${isSelected ? "slot-selected" : ""}`}
                disabled={!canBookSlot}
                onClick={() => handleSlotClick(slot)}
                title={slotIsPast ? "This time slot has already passed" : undefined}
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

      {isAddAmenityOpen && (
        <div className="amenity-modal-backdrop" role="presentation" onMouseDown={closeAddAmenityForm}>
          <form className="amenity-modal" onSubmit={handleCreateAmenity} onMouseDown={(event) => event.stopPropagation()}>
            <div className="amenity-modal-header">
              <div>
                <h2>Add Amenity</h2>
                <p>Create a new bookable facility for your society.</p>
              </div>
              <button type="button" className="amenity-modal-close" onClick={closeAddAmenityForm} aria-label="Close add amenity form">
                ×
              </button>
            </div>

            {amenityFormMessage && (
              <p className={`amenity-message amenity-message-${amenityFormMessage.type}`}>{amenityFormMessage.text}</p>
            )}

            <div className="amenity-form-grid">
              <label>Name<input required value={amenityForm.name} onChange={(event) => updateAmenityField("name", event.target.value)} /></label>
              <label>Capacity<input required type="number" min="1" value={amenityForm.capacity} onChange={(event) => updateAmenityField("capacity", event.target.value)} /></label>
              <label>Slot duration (mins)<input required type="number" min="1" value={amenityForm.slotDurationMins} onChange={(event) => updateAmenityField("slotDurationMins", event.target.value)} /></label>
              <label>Opening time<input required type="time" value={amenityForm.openingTime} onChange={(event) => updateAmenityField("openingTime", event.target.value)} /></label>
              <label>Closing time<input required type="time" value={amenityForm.closingTime} onChange={(event) => updateAmenityField("closingTime", event.target.value)} /></label>
            </div>

            <div className="amenity-modal-actions">
              <button type="button" className="btn-cancel-select" onClick={closeAddAmenityForm} disabled={creatingAmenity}>Cancel</button>
              <button type="submit" className="btn-confirm-booking" disabled={creatingAmenity}>{creatingAmenity ? "Creating…" : "Create Amenity"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
