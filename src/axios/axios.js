// axios/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.73:5000/api/", // Remover espaço extra
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
  postChecklist: (checklist) => api.post("/checklists", checklist),
  getChecklists: (idUsuario) => api.get(`/checklists/${idUsuario}`),
  updateChecklist: (idChecklist, checklist) => api.put(`/checklists/${idChecklist}`, checklist),
  deleteChecklist: (idChecklist) => api.delete(`/checklists/${idChecklist}`),

  // Itens de Checklist
  postItemChecklist: (item) => api.post("/itemChecklists", item),
  getItemChecklists: (idChecklist) => api.get(`/itemChecklists/${idChecklist}`),
  updateItemChecklist: (idChecklist, item) => api.put(`/itemChecklists/${idChecklist}`, item),
  deleteItemChecklist: (idChecklist) => api.delete(`/itemChecklists/${idChecklist}`),

  //Finanças
  criarFinanca: (financa) => api.post("/criarFinanca/", financa),

  // Consulta de Finanças
  gastoseganhosporMes: (fk_id_usuario) => api.get(`/gastoseganhosporMes/${fk_id_usuario}`),
  listarTransacoes: (fk_id_usuario) => api.get(`/listarTransacoes/${fk_id_usuario}`),
};

export default sheets;
