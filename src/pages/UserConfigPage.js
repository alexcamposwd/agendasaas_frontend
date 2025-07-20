import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UserConfig from "../components/UserConfig";
import ServiceConfig from "../components/ServiceConfig";
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

export default function UserConfigPage() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 470, margin: "25px auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{marginRight:7}}>Calendário</button></Link>
        <Link to="/config"><button style={{marginRight:7}}>Configurar Serviços</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <Button onClick={sair} style={{float:"right"}}>Sair</Button>
      </nav>
      <h2>Configurações</h2>
      <UserConfig />
      <ServiceConfig />
    </div>
  );
}
