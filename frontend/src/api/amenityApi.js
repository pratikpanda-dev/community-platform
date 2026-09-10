const BASE_URL = "http://localhost:8080/api/amenities";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const amenityApi = {
  getAll: (societyId) =>
    fetch(`${BASE_URL}?societyId=${societyId}`).then(handleResponse),

  getAvailability: (amenityId, date) =>
    fetch(`${BASE_URL}/${amenityId}/availability?date=${date}`).then(handleResponse),
};