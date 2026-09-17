import { apiClient } from "./apiClient";

const PATH = "/api/staff-profiles";

export const staffProfileApi = {
  create: (profile) => apiClient.post(PATH, profile),
  getByEmployeeId: (employeeId) => apiClient.get(`${PATH}/${employeeId}`),
};
