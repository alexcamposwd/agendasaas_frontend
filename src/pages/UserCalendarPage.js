import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Calendar from "../components/Calendar";
import AppointmentConfig from "../components/AppointmentConfig";

export default function UserCalendarPage() {
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [cfg, setCfg] = useState({
    horarioAtendimento: { inicio: "07:00", fim: "18:00" },
    servicos: []
  });
  const [agendamentosMes, setAgendamentosMes] = useState([]);
  const today = new Date();
  const [calY, setCalY] = useState(today.getFullYear());
  const [calM, setCalM] = useState(today.getMonth());
  const navigate = useNavigate();

  // Monta o apptMap: { "YYYY-MM-DD": [array de agendamentos deste dia] }
  const apptMap = {};
  agendamentosMes.forEach(a => {
    if (!apptMap[a.data]) apptMap[a.data] = [];
    apptMap[a.data].push(a);
  });

  // Função para buscar configurações (serviços, horários)
  async function fetchConfig() {
    const { data } = await api.get("/users/config");
    setCfg(data);
  }

  // Função para buscar agendamentos de todo mês
  async function fetchAgendamentos() {
    const mes = `${calY}-${String(calM + 1).padStart(2, '0')}`;
    const res = await api.get("/appointments/by-month", { params: { mes } });
    setAgendamentosMes(res.data);
  }

  useEffect(() => { fetchAgendamentos(); fetchConfig(); }, [calY, calM]);

  function handleMonthChange(delta) {
    let ano = calY;
    let mes = calM + delta;
    if (mes < 0) { mes = 11; ano--; }
    if (mes > 11) { mes = 0; ano++; }
    setCalY(ano);
    setCalM(mes);
  }

  function afterAgendar() {
    setDataSelecionada(null);
    fetchAgendamentos();
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  function sair() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 490, margin: "25px auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{marginRight:7}}>Calendário</button></Link>
        <Link to="/config"><button style={{marginRight:7}}>Configurar Serviços</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <button onClick={sair} style={{float:"right"}}>Sair</button>
      </nav>
      <h2>Agendar Atendimento</h2>
      <Calendar
        year={calY}
        month={calM}
        todayDate={todayStr}
        onMonthChange={handleMonthChange}
        onDayClick={setDataSelecionada}
        apptMap={apptMap}
        horarioAtendimento={cfg.horarioAtendimento}
        servicos={cfg.servicos}
      />
      {/* Atenção AQUI: passar sempre cfg.servicos atualizado */}
      <AppointmentConfig
        dataAgendamento={dataSelecionada}
        servicos={cfg.servicos}
        horarioAtendimento={cfg.horarioAtendimento}
        onAgendado={afterAgendar}
      />
    </div>
  );
}

