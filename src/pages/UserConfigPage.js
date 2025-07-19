import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UserConfig from "../components/UserConfig";
import ServiceConfig from "../components/ServiceConfig";

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
        <button onClick={sair} style={{float:"right"}}>Sair</button>
      </nav>
      <h2>Configurações</h2>
      <UserConfig />
      <ServiceConfig />
    </div>
  );
}
