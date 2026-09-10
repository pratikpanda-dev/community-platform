const BASE_URL = "http://localhost:8080/api/bookings";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  const body = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(typeof body === "string" ? body : "Booking failed");
  }
  return body;
}

export const bookingApi = {
  create: (booking) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    }).then(handleResponse),

  getMyBookings: (userId) =>
    fetch(`${BASE_URL}/my?userId=${userId}`).then(handleResponse),

  cancel: (bookingId) =>
    fetch(`${BASE_URL}/${bookingId}`, { method: "DELETE" }).then(handleResponse),
};