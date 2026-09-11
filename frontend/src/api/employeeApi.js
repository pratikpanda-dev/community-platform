import { apiClient } from "./apiClient";

const PATH = "/api/employee.v1";

export const employeeApi = {
  getAllEmployees: (societyId) => apiClient.get(`${PATH}?societyId=${societyId}`),

  getEmployeeById: (id) => apiClient.get(`${PATH}/${id}`),

  createEmployee: (employee) => apiClient.post(`${PATH}/create`, employee),

  updateEmployee: (id, employee) => apiClient.put(`${PATH}/update/${id}`, employee),

  removeEmployee: (id) => apiClient.delete(`${PATH}/${id}`),
};