// axios/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.56.1:5000/api/", // Atualize esta URL conforme necessário
  headers: {
    Accept: "application/json",
  },
});

const sheets = {
  // Usuários
  createUser: (user) => api.post("/createUser", user),
  postLogin: (data) => api.post("/login", data),
  getUsers: () => api.get("users"),
  updateUser: (id, updatedData) => api.put(`/updateUser/${id}`, updatedData),
  deleteUser: (id) => api.delete(`/deleteUser/${id}`),

  // Notas (Agenda)
  postNota: (nota) => api.post("/postNota", nota),
  getNota: (idUsuario) => api.get(`/getNota/${idUsuario}`),
  updateNota: (idNota, nota) => api.put(`/updateNota/${idNota}`, nota),
  deleteNota: (idNota) => api.delete(`/deleteNota/${idNota}`),

  // Checklists
  postChecklist: (checklist) => api.post("/checklists", checklist),
  getChecklists: (idUsuario) => api.get(`/checklists/${idUsuario}`),
  updateChecklist: (idChecklist, checklist) => api.put(`/checklists/${idChecklist}`, checklist),
  deleteChecklist: (idChecklist) => api.delete(`/checklists/${idChecklist}`),

  // Itens de Checklist
  postItemChecklist: (item) => api.post("/itemChecklists", item),
  getItemChecklists: (idChecklist) => api.get(`/itemChecklists/${idChecklist}`),
  updateItemChecklist: (idChecklist, item) => api.put(`/itemChecklists/${idChecklist}`, item),
  deleteItemChecklist: (idChecklist) => api.delete(`/itemChecklists/${idChecklist}`),
};

export default sheets;
