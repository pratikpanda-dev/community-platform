import { apiClient } from "./apiClient";

const PATH = "/api/visitor-passes";

export const visitorPassApi = {
  create: (pass) => apiClient.post(PATH, pass),
  getMine: () => apiClient.get(`${PATH}/mine`),
};
