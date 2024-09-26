// axios/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.98:5000/api/", // Remover espaço extra
  headers: {
    Accept: "application/json",
  },
});

const sheets = {
  // Usuários
  createUser: (user) => api.post("/createUser", user),
  postLogin: (data) => api.post("/login", data),
  getUsers: () => api.get("/users"),
  updateUser: (id, updatedData) => api.put(`/updateUser/${id}`, updatedData),
  deleteUser: (id) => api.delete(`/deleteUser/${id}`),

  // Notas (Agenda)
  postNota: (nota) => api.post("/postNota", nota),
  getNota: (idUsuario) => api.get(`/getNota/${idUsuario}`),
  updateNota: (idNota, nota) => api.put(`/updateNota/${idNota}`, nota),
  deleteNota: (idNota) => api.delete(`/deleteNota/${idNota}`),

  // Checklists
  postChecklist: (checklist) => api.post("/postChecklist/", checklist),
  getChecklists: (idUsuario) => api.get(`/getChecklist/${idUsuario}`),
  updateChecklist: (idChecklist, checklist) => api.put(`/updateChecklist/${idChecklist}`, checklist),
  deleteChecklist: (idChecklist) => api.delete(`/deleteChecklist/${idChecklist}`),

  // Itens de Checklist
  postItemChecklist: (item) => api.post("/postItemChecklist/", item),
  getItemChecklists: (idChecklist) => api.get(`/getItemChecklist/${idChecklist}`),
  updateItemChecklist: (idChecklist, item) => api.put(`/updateItemChecklist/${idChecklist}`, item),
  deleteItemChecklist: (fkIdChecklist) => api.delete(`/deleteItemChecklist/${fkIdChecklist}`),

  //Finanças
  criarFinanca: (financa) => api.post("/criarFinanca/", financa),

  // Consulta de Finanças
  gastoseganhosporMes: (fk_id_usuario) => api.get(`/gastoseganhosporMes/${fk_id_usuario}`),
  listarTransacoes: (fk_id_usuario) => api.get(`/listarTransacoes/${fk_id_usuario}`),
};

export default sheets;
