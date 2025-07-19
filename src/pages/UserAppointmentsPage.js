import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AppointmentList from "../components/AppointmentList";

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
    <div style={{ maxWidth: 470, margin: "25px auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{marginRight:7}}>Calendário</button></Link>
        <Link to="/config"><button style={{marginRight:7}}>Configurar Serviços</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <button onClick={sair} style={{float:"right"}}>Sair</button>
      </nav>
      <h2>Meus Agendamentos</h2>
      <AppointmentList
        appointments={appts}
        onRemove={async (id) => { await api.delete(`/appointments/${id}`); fetch(); }}
      />
    </div>
  );
}
