const TOKEN_KEY = "community_token";

export const authStorage = {
  saveToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getPayload() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64Payload = token.split(".")[1];
      return JSON.parse(atob(base64Payload));
    } catch {
      return null;
    }
  },
};