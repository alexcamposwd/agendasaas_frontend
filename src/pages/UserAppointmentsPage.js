import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AppointmentList from "../components/AppointmentList";
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

// Estilo para o botão/ícone
const ConfigButton = styled(Link)`
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 1.8em;
  color: ${({ theme }) => theme.primary};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
`;

export default function UserAppointmentsPage() {
  const [appts, setAppts] = useState([]);
  const navigate = useNavigate();

  async function fetch() {
    const lista = await api.get("/appointments");
    setAppts(lista.data);
  }

  useEffect(() => { fetch(); }, []);

  function sair() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 470, margin: "25px auto", position: "relative" }}>
      <ConfigButton to="/config" aria-label="Configurações">
        ⚙️
      </ConfigButton>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{marginRight:7}}>Calendário</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <Button onClick={sair} style={{float:"right"}}>Sair</Button>
      </nav>
      <h2>Meus Agendamentos</h2>
      <AppointmentList
        appointments={appts}
        onRemove={async (id) => { await api.delete(`/appointments/${id}`); fetch(); }}
      />
    </div>
  );
}
