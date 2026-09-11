import { apiClient } from "./apiClient";

const PATH = "/api/bookings";

export const bookingApi = {
  create: (booking) => apiClient.post(PATH, booking),
  getMyBookings: (userId) => apiClient.get(`${PATH}/my?userId=${userId}`),
  cancel: (bookingId) => apiClient.delete(`${PATH}/${bookingId}`),
};