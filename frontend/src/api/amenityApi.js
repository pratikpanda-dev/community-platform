import { apiClient } from "./apiClient";

const PATH = "/api/amenities";

export const amenityApi = {
  getAll: (societyId) => apiClient.get(`${PATH}?societyId=${societyId}`),
  getAvailability: (amenityId, date, signal) =>
  apiClient.get(`${PATH}/${amenityId}/availability?date=${date}`, signal),
  create: (amenity) => apiClient.post(PATH, amenity),
};