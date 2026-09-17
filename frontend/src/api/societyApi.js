import { apiClient } from "./apiClient";

const PATH = "/api/societies";

export const societyApi = {
  getAll: () => apiClient.get(PATH),
  create: (society) => apiClient.post(PATH, society),
};