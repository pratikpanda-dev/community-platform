import { apiClient } from "./apiClient";

const PATH = "/api/complaints";

export const complaintApi = {
  getAll: (societyId, status) => {
    const query = status ? `?societyId=${societyId}&status=${status}` : `?societyId=${societyId}`;
    return apiClient.get(`${PATH}${query}`);
  },
  create: (complaint) => apiClient.post(PATH, complaint),
  updateStatus: (id, status) => apiClient.patch(`${PATH}/${id}/status`, { status }),
};