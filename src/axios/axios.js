import axios from "axios";

// Configuração da base URL da API
const api = axios.create({
  baseURL: "http://10.89.234.134:5000/api/", // Atualize esta URL conforme necessário
  headers: {
    Accept: "application/json",
  },
});

const sheets = {
  // Usuários
  createUser: (user) => api.post("/createUser", user),// Método para criar um novo usuário
  postLogin: (data) => api.post("/login", data),// Método de login
  getUsers: () => api.get("users"),// Método para obter a lista de usuários
  updateUser: (id, updatedData) => api.put(`/updateUser/${id}`, updatedData),// Método para atualizar informações de um usuário específico pelo ID
  deleteUser: (id) => api.delete(`/deleteUser/${id}`),// Método para deletar um usuário específico pelo ID

  // Notas (Agenda)
  postNota: (nota) => api.post("/postNota", nota),  // Método para criar uma nova nota
  getNota: (idUsuario) => api.get(`/getNota/${idUsuario}`), // Método para buscar notas por ID do usuário
  updateNota: (idNota, nota) => api.put(`/updateNota/${idNota}`, nota), // Método para atualizar uma nota
  deleteNota: (idNota) => api.delete(`/deleteNota/${idNota}`), // Método para deletar uma nota específica
};

export default sheets;
