import { apiClient } from "./apiClient";

const PATH = "/api/attendance";

export const attendanceApi = {
  checkIn: (employeeId) => apiClient.post(`${PATH}/check-in?employeeId=${employeeId}`),
  checkOut: (employeeId) => apiClient.post(`${PATH}/check-out?employeeId=${employeeId}`),
  getTodaySummary: () => apiClient.get(`${PATH}/summary`),
};