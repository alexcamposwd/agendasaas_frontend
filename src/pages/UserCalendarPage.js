import React, { useEffect, useState, useCallback } from "react";
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

  // Função para buscar agendamentos de todo mês
  const fetchAgendamentos = useCallback(async () => {
    const mes = `${calY}-${String(calM + 1).padStart(2, '0')}`;
    try {
      const res = await api.get("/appointments/by-month", { params: { mes } });
      setAgendamentosMes(res.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos do mês:", error);
      // Lógica para lidar com o erro, se necessário
    }
  }, [calY, calM]);

  // Função para buscar configurações (serviços, horários)
  async function fetchConfig() {
    try {
      const { data } = await api.get("/users/config");
      setCfg(data);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      // Lógica para lidar com o erro, se necessário
    }
  }

  useEffect(() => {
    fetchAgendamentos();
    fetchConfig();
  }, [fetchAgendamentos]);

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
    <div style={{
      maxWidth: 490,
      margin: "25px auto",
      position: "relative",
      paddingRight: 50,  /* Ajuste aqui para evitar sobreposição */
    }}> {/* relative para posicionar o botão */}
      <ConfigButton to="/config" aria-label="Configurações">
        ⚙️
      </ConfigButton>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{ marginRight: 7 }}>Calendário</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <button onClick={sair} style={{ float: "right" }}>Sair</button>
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


