import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.234.134:5000/api/", // Atualize esta URL conforme necessário
  headers: {
    Accept: "application/json",
  },
});

const sheets = {
  // Usuários
  createUser: (user) => api.post("/createUser", user),// Método para criar um novo usuário
  postLogin: (data) => api.post("/login", data),// Método para obter a lista de usuários
  getUsers: () => api.get("/users"),
  updateUser: (id, updatedData) => api.put(`/updateUser/${id}`, updatedData),// Método para deletar um usuário específico pelo ID
  deleteUser: (id) => api.delete(`/deleteUser/${id}`),// Método para atualizar informações de um usuário específico pelo ID

  // Notas (Agenda)
  postNota: (nota) => api.post("/postNota", nota),  // Método para criar uma nova nota
  getNota: (data) => api.post("/getNota", data),    // Método para buscar uma nota por data e hora
  updateNota: (nota) => api.put("/updateNota", nota), // Método para atualizar ou deletar uma nota
};

export default sheets;
