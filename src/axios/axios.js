import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.83:5000/api/", // Remover espaço extra
  headers: {
    Accept: "application/json",
  },
});

const sheets = {
  // Usuários
  createUser: (user) => api.post("/createUser", user),
  postLogin: (data) => api.post("/login", data),
  getUsers: () => api.get("/getUsers"),
  updateUser: (id, updatedData) => api.put(`/updateUser/${id}`, updatedData),
  deleteUser: (id) => api.delete(`/deleteUser/${id}`),

  // Notas (Agenda)
  postNota: (nota) => api.post("/postNota", nota),
  getNota: (idUsuario) => api.get(`/getAnotacao/${idUsuario}`),
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

  // Finanças
  criarFinanca: (financa) => api.post("/criarFinanca/", financa),
  listarFinancas: (idUsuario) => api.get(`/listarFinancas/${idUsuario}`),
  atualizarFinanca: (id_financa, financa) => api.put(`/atualizarFinanca/${id_financa}`, financa),
  deletarFinanca: (id_financa) => api.delete(`/deletarFinanca/${id_financa}`),

  // Novas rotas de finanças
  obterRendaAtual: (idUsuario) => api.get(`/obterRendaAtual/${idUsuario}`),
  resumoFinanceiro: (idUsuario) => api.get(`/resumoFinanceiro/${idUsuario}`),
  transacoes: (idUsuario) => api.get(`/transacoes/${idUsuario}`),
};

export default sheets;
