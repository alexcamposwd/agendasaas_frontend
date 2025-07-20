import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Calendar from "../components/Calendar";
import AppointmentConfig from "../components/AppointmentConfig";
import styled from "styled-components";

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
  z-index: 1; /* Garante que o botão fique acima de outros elementos */
`;

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
    <div style={{ maxWidth: 490, margin: "25px auto", position: "relative", paddingRight: 50, }}>
      <ConfigButton to="/config" aria-label="Configurações">
        ⚙️
      </ConfigButton>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{marginRight:7}}>Calendário</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <Button onClick={sair} style={{float:"right"}}>Sair</Button>
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

