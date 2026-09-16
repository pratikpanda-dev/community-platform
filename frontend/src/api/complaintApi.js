import { apiClient } from "./apiClient";

const PATH = "/api/complaints";

export const complaintApi = {
  getAll: (status) => {
    const query = status ? `?status=${status}` : "";
    return apiClient.get(`${PATH}${query}`);
  },
  create: (complaint) => apiClient.post(PATH, complaint),
  updateStatus: (id, status) => apiClient.patch(`${PATH}/${id}/status`, { status }),
};