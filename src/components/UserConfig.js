import React, { useState, useEffect } from "react";
import api from "../services/api";

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
      <div>
        Início: <input type="time" value={inicio} onChange={e => setInicio(e.target.value)} required />
          Fim: <input type="time" value={fim} onChange={e => setFim(e.target.value)} required />
         <button type="submit">Salvar</button>
      </div>
      {msg && <span style={{color:"green", marginLeft:7}}>{msg}</span>}
    </form>
  );
}
