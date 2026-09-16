import { authStorage } from "../auth/authStorage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  const body = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (res.status === 401) {
    authStorage.clearToken();
    window.location.reload();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(typeof body === "string" ? body : "Request failed");
  }
  return body;
}

export const apiClient = {
  get(path, signal) {
    return fetch(`${BASE_URL}${path}`, {
      headers: authHeaders(),
      signal,
    }).then(handleResponse);
  },

  post(path, data) {
    return fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  put(path, data) {
    return fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  patch(path, data) {
    return fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  delete(path) {
    return fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse);
  },
};

function authHeaders() {
  const token = authStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}