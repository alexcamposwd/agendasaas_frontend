import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import styled from "styled-components";

// Card visual bonito para mobile
const Card = styled.form`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(124, 77, 255, 0.07);
  padding: 22px 16px 16px 16px;
  max-width: 380px;
  width: 98vw;
  margin: 0 auto 18px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HorarioGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin: 12px 0 7px 0;
`;

const HoraBtn = styled.button`
  min-width: 68px;
  font-size: 1em;
  padding: 6px 0;
  border-radius: 8px;
  border: 1.2px solid ${({ theme }) => theme.primary};
  background: ${({ selected, ocupado, theme }) =>
    ocupado
      ? "#fde0ef"
      : selected
      ? `linear-gradient(90deg, ${theme.primary}, ${theme.secondary} 92%)`
      : theme.card};
  color: ${({ ocupado, selected, theme }) =>
    ocupado
      ? "#bbb"
      : selected
      ? "#fff"
      : theme.primary};
  opacity: ${({ ocupado }) => (ocupado ? 0.5 : 1)};
  font-weight: 500;
  cursor: ${({ ocupado }) => (ocupado ? "not-allowed" : "pointer")};
  transition: background 0.2s, color 0.2s;
`;

const SuccessMsg = styled.div`
  color: #2e7d32;
  padding: 6px 0;
  font-weight: bold;
  text-align: center;
`;

const ErrorMsg = styled.div`
  color: #e53935;
  background: #fff0f1;
  padding: 7px 0;
  margin: 5px 0 7px 0;
  border-radius: 9px;
  text-align: center;
  font-weight: 600;
`;

export default function AppointmentConfig({
  dataAgendamento,
  onAgendado,
  servicos,
  horarioAtendimento,
}) {
  const [servico, setServico] = useState(servicos[0]?.nome || "");
  const [apptsDia, setApptsDia] = useState([]);
  const [nome, setNome] = useState("");
  const [horaEscolhida, setHoraEscolhida] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  // Utilitários
  const timeToMinutes = useCallback((time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }, []);

  // Função para buscar agendamentos do dia
  const fetchAppointments = useCallback(async () => {
    if (!dataAgendamento) return;
    try {
      const { data } = await api.get("/appointments/by-date", {
        params: { data: dataAgendamento },
      });
      setApptsDia(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos do dia:", error);
      setErro("Erro ao carregar horários");
    }
  }, [api, dataAgendamento]);

  // Gera a grade de horários do dia selecionado, considerando bloqueios
  const gerarHorarios = useCallback(() => {
    if (
      !horarioAtendimento?.inicio ||
      !horarioAtendimento?.fim ||
      !servicos.length
    )
      return [];
    const serv = servicos.find((s) => s.nome === servico);
    if (!serv) return [];
    const step = 15;
    const [hi, mi] = horarioAtendimento.inicio.split(":").map(Number);
    const [hf, mf] = horarioAtendimento.fim.split(":").map(Number);

    const horariosGrade = [];
    let d = new Date();
    d.setHours(hi, mi, 0, 0);
    const dmax = new Date();
    dmax.setHours(hf, mf, 0, 0);
    while (d.getHours() * 60 + d.getMinutes() <= hf * 60 + mf) {
      horariosGrade.push(
        `${String(d.getHours()).padStart(2, 0)}:${String(
          d.getMinutes()
        ).padStart(2, 0)}`
      );
      d = new Date(d.getTime() + step * 60000);
    }
    // Bloqueia ocupados do dia pelos agendamentos existentes
    const bloqueados = [];
    apptsDia.forEach((a) => {
      const ini = timeToMinutes(a.hora);
      const dur = a.servico?.duracao || 0;
      for (let t = ini; t < ini + dur; t += step) {
        bloqueados.push(
          `${String(Math.floor(t / 60)).padStart(2, 0)}:${String(
            t % 60
          ).padStart(2, 0)}`
        );
      }
    });

    return horariosGrade.map((h) => ({
      hora: h,
      ocupado: bloqueados.includes(h),
    }));
  }, [
    apptsDia,
    horarioAtendimento?.fim,
    horarioAtendimento?.inicio,
    servico,
    servicos,
    timeToMinutes,
  ]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    gerarHorarios();
  }, [gerarHorarios]);

  const renderContent = () => {
    if (!dataAgendamento || !servicos.length) return null;

    const horarios = gerarHorarios();

    return (
      <Card onSubmit={agendar}>
        <div
          style={{
            marginBottom: 9,
            textAlign: "center",
            color: "#8E24AA",
          }}
        >
          <b>Agendar para {dataAgendamento.replace(/-/g, "/")}</b>
        </div>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome (opcional)"
        />
        <select
          value={servico}
          onChange={(e) => setServico(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 7,
            fontSize: "1.03em",
            padding: "9px 7px",
            borderRadius: 10,
            border: `1.2px solid #ce93d8`,
          }}
        >
          {servicos.map((s, idx) => (
            <option key={idx} value={s.nome}>
              {s.nome} — {s.duracao}min
            </option>
          ))}
        </select>
        <div style={{ marginBottom: 3, fontWeight: 600 }}>
          Escolha um horário:
        </div>
        <HorarioGrid>
          {horarios.map((h, idx) => (
            <HoraBtn
              type="button"
              key={idx}
              ocupado={h.ocupado}
              selected={h.hora === horaEscolhida}
              onClick={() => !h.ocupado && setHoraEscolhida(h.hora)}
              tabIndex={h.ocupado ? -1 : 0}
            >
              {h.hora}
            </HoraBtn>
          ))}
        </HorarioGrid>
        <Button type="submit" disabled={!horaEscolhida}>
          Agendar
        </Button>
        {erro && <ErrorMsg>{erro}</ErrorMsg>}
        {msg && <SuccessMsg>{msg}</SuccessMsg>}
      </Card>
    );
  };

  async function agendar(e) {
    e.preventDefault();
    setMsg("");
    setErro("");
    const serv = servicos.find((s) => s.nome === servico);
    if (!serv || !horaEscolhida) return setErro("Escolha todos os campos!");
    try {
      await api.post("/appointments", {
        clienteNome: nome,
        servico: { nome: serv.nome, duracao: Number(serv.duracao) },
        data: dataAgendamento,
        hora: horaEscolhida,
      });
      setMsg("Agendado com sucesso!");
      setNome(""); // <== Adicione esta linha para limpar o nome
      setTimeout(() => {
        setMsg("");
        onAgendado();
      }, 1200);
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao agendar");
    }
  }

  return renderContent();
}

// Input e Button estilos reaproveitados de outros componentes:
const Input = styled.input`
  font-size: 1em;
  padding: 10px 12px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border: 1.2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
`;

const Button = styled.button`
  width: 100%;
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.primary},
    ${({ theme }) => theme.secondary} 94%
  );
  color: #fff;
  font-weight: bold;
  border: none;
  box-shadow: 0 1px 6px 0 rgba(124, 77, 255, 0.09);
  font-size: 1.03em;
  margin-top: 8px;
  transition: filter 0.18s;
  &:active {
    filter: brightness(0.93);
  }
  &:disabled {
    background: #eee;
    color: #aaa;
  }
`;


