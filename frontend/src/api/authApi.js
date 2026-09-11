const BASE_URL = "http://localhost:8080/api/auth";

export const authApi = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type");
    const body = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw new Error(typeof body === "string" ? body : "Login failed");
    }
    return body;
  },
};