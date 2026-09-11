const BASE_URL = "http://localhost:8080/api/attendance";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  const body = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(typeof body === "string" ? body : "Request failed");
  }
  return body;
}

export const attendanceApi = {
  checkIn: (employeeId) =>
    fetch(`${BASE_URL}/check-in?employeeId=${employeeId}`, {
      method: "POST",
    }).then(handleResponse),

  checkOut: (employeeId) =>
    fetch(`${BASE_URL}/check-out?employeeId=${employeeId}`, {
      method: "POST",
    }).then(handleResponse),

  getTodaySummary: () =>
    fetch(`${BASE_URL}/summary`).then(handleResponse),
};