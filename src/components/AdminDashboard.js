import React, { useState, useEffect } from "react";
import api from "../services/api";
import styled from "styled-components";
import UserList from "./UserList";
import AppointmentList from "./AppointmentList";
import styled from "styled-components";

const Button = styled.button`
  background: linear-gradient(45deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: 20px;      // Mais arredondado
  padding: 12px 25px;
  font-size: 1em;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);    // Sombra mais definida
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);            // Leve elevação ao passar o mouse
  }
`

const CardForm = styled.div`
  background: #fffbe7;
  padding: 16px;
  margin-bottom: 22px;
  border-radius: 6px;
`;

export default function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nome: "", email: "", senha: "" });
  const [appts, setAppts] = useState([]);
  const [viewUserId, setViewUserId] = useState(null);

  function sair() {
    localStorage.removeItem("token");
    onLogout();
  }

  async function fetchUsers() {
    const res = await api.get("/users");
    setUsers(res.data);
  }
  async function fetchAppts() {
    const res = await api.get("/admin/appointments");
    setAppts(res.data);
  }

  useEffect(() => {
    fetchUsers();
    fetchAppts();
  }, []);

  async function criarUser(e) {
    e.preventDefault();
    await api.post("/users", newUser);
    setNewUser({ nome: "", email: "", senha: "" });
    fetchUsers();
  }

  async function mudarStatus(id, status) {
    const novo = status === "ativo" ? "bloqueado" : "ativo";
    await api.patch(`/users/${id}/status`, { status: novo });
    fetchUsers();
  }
  async function excluirUser(id) {
    await api.delete(`/users/${id}`);
    fetchUsers();
  }

  const apptsFiltrados = appts.filter(a => !viewUserId || (a.userId && a.userId._id === viewUserId));

  return (
    <div style={{ maxWidth: 700, margin: "30px auto" }}>
      <h2>Administração</h2>
      <CardForm as="form" onSubmit={criarUser}>
        <h4>Criar Novo Usuário</h4>
        <input placeholder="Nome" value={newUser.nome} onChange={e => setNewUser({...newUser, nome:e.target.value})} required style={{marginRight:6}}/>
        <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email:e.target.value})} required style={{marginRight:6}}/>
        <input placeholder="Senha" value={newUser.senha} type="password" onChange={e => setNewUser({...newUser, senha:e.target.value})} required style={{marginRight:6}}/>
        <Button type="submit">Criar Usuário</Button>
      </CardForm>
      <h3>Usuários</h3>
      <UserList
        users={users}
        onBlockToggle={mudarStatus}
        onDelete={excluirUser}
        onViewAgenda={setViewUserId}
      />
      <h3>
        Agendamentos{" "}
        {viewUserId && (
          <button onClick={() => setViewUserId(null)} style={{ marginLeft: 12 }}>Ver todos</button>
        )}
      </h3>
      <AppointmentList appointments={apptsFiltrados} adminView />
      <button onClick={sair} style={{ marginTop: 20 }}>Sair</button>
    </div>
  );
}
