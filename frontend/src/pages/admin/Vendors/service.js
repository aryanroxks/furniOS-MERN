import api from "../../../services/api.js";

export const vendorApi = {
  getAll: (params) =>
    api.get("/vendors", { params }),

  getById: (id) =>
    api.get(`/vendors/${id}`),

  create: (data) =>
    api.post("/vendors", data),

  update: (id, data) =>
    api.patch(`/vendors/${id}`, data),

  toggleStatus: (id) =>
    api.patch(`/vendors/${id}/status`)
};
