import React, { useEffect, useState } from "react";
import api from "../services/api";
import AppointmentList from "./AppointmentList";
import Calendar from "./Calendar";
import UserConfig from "./UserConfig";
import ServiceConfig from "./ServiceConfig";
import AppointmentConfig from "./AppointmentConfig";

export default function UserDashboard({ onLogout }) {
  const [appts, setAppts] = useState([]);
  const [monthAgend, setMonthAgend] = useState({});
  const [monthPreenchido, setMonthPreenchido] = useState({});
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [cfg, setCfg] = useState({ horarioAtendimento:{inicio:"07:00",fim:"18:00"}, servicos:[] });

  const today = new Date();
  const [calY, setCalY] = useState(today.getFullYear());
  const [calM, setCalM] = useState(today.getMonth());

  function sair() {
    localStorage.removeItem("token");
    onLogout();
  }

  async function fetch() {
    // Todos meus agendamentos
    const lista = await api.get("/appointments");
    setAppts(lista.data);
    // Agenda do mês
    const mes = `${calY}-${String(calM+1).padStart(2,'0')}`;
    const res = await api.get("/appointments/by-month", { params: { mes } });
    const apptSet = {};
    const filledSet = {};
    const dias = {};
    res.data.forEach(a => {
      apptSet[a.data] = true;
      dias[a.data] = (dias[a.data]||0)+1;
    });
    // Um dia está fully filled se toda a grade daquele dia está ocupada
    // Aqui vamos considerar apenas a existência de algum agendamento (contorno)
    for(const d in dias) {
      if (dias[d]>=1) filledSet[d]=true;
    }
    setMonthAgend(apptSet);
    setMonthPreenchido(filledSet);
  }

  async function fetchConfig() {
    const {data} = await api.get("/users/config");
    setCfg(data);
  }

  useEffect(() => { fetch(); fetchConfig(); }, [calY, calM]);

  function handleMonthChange(delta) {
    let ano = calY;
    let mes = calM + delta;
    if (mes < 0) { mes = 11; ano--; }
    if (mes > 11) { mes = 0; ano++; }
    setCalY(ano); setCalM(mes);
  }

  function afterAgendar() {
    setDataSelecionada(null);
    fetch();
  }

  // Exemplo: para preencher o número somente nos dias do mês corrente
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  return (
    <div style={{ maxWidth: 470, margin: "25px auto" }}>
      <h2>Minha Agenda</h2>
      <UserConfig />
      <ServiceConfig />
      <Calendar
        year={calY}
        month={calM}
        todayDate={todayStr}
        onMonthChange={handleMonthChange}
        onDayClick={setDataSelecionada}
        apptMap={monthAgend}
        filledMap={monthPreenchido}
      />
      <AppointmentConfig
        dataAgendamento={dataSelecionada}
        servicos={cfg.servicos}
        horarioAtendimento={cfg.horarioAtendimento}
        onAgendado={afterAgendar}
      />
      <h3 style={{marginTop:32}}>Agendamentos</h3>
      <AppointmentList appointments={appts} onRemove={async (id) => { await api.delete(`/appointments/${id}`); fetch(); }} />
      <button onClick={sair} style={{ marginTop: 20 }}>Sair</button>
    </div>
  );
}
