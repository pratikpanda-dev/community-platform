const BASE_URL = "http://localhost:8080/api/complaints";

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

export const complaintApi = {
  getAll: (societyId, status) => {
    const query = status
      ? `?societyId=${societyId}&status=${status}`
      : `?societyId=${societyId}`;
    return fetch(`${BASE_URL}${query}`).then(handleResponse);
  },

  create: (complaint) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaint),
    }).then(handleResponse),

  updateStatus: (id, status) =>
    fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(handleResponse),
};