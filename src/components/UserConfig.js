import React, { useState, useEffect } from "react";
import api from "../services/api";
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

export default function UserConfig() {
  const [inicio, setInicio] = useState("07:00");
  const [fim, setFim] = useState("18:00");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function fetchHorario() {
      const { data } = await api.get("/users/config");
      if (data.horarioAtendimento) {
        setInicio(data.horarioAtendimento.inicio);
        setFim(data.horarioAtendimento.fim);
      }
    }
    fetchHorario();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    await api.patch("/users/config/horario", { inicio, fim });
    setMsg("Salvo!");
    setTimeout(() => setMsg(""), 1500);
  }

  return (
    <form style={{ marginBottom: 24 }} onSubmit={salvar}>
      <h4>Horários de Atendimento</h4>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div>
          Início: <input type="time" value={inicio} onChange={e => setInicio(e.target.value)} required />
        </div>
        <div>
          Fim: <input type="time" value={fim} onChange={e => setFim(e.target.value)} required />
        </div>
        <Button type="submit" style={{ marginTop: 10 }}>Salvar</Button>
      </div>
      {msg && <span style={{ color: "green", marginLeft: 7 }}>{msg}</span>}
    </form>                   
  );
}
