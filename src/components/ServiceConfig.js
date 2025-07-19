import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function ServiceConfig() {
  const [servicos, setServicos] = useState([]);
  const [novo, setNovo] = useState({ nome: "", duracao: 30 });

  async function fetch() {
    const { data } = await api.get("/users/config/servicos");
    setServicos(data);
  }

  useEffect(() => { fetch(); }, []);

  async function adicionar(e) {
    e.preventDefault();
    await api.post("/users/config/servicos", novo);
    setNovo({ nome: "", duracao: 30 });
    fetch();
  }

  async function remover(idx) {
    await api.delete(`/users/config/servicos/${idx}`);
    fetch();
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h4>Serviços</h4>
      <form onSubmit={adicionar} style={{ marginBottom: 8 }}>
        <input placeholder="Nome" value={novo.nome} onChange={e => setNovo({ ...novo, nome: e.target.value })} required style={{marginRight:5}}/>
        <input type="number" placeholder="Duração (min)" value={novo.duracao}
          onChange={e => setNovo({ ...novo, duracao: Math.max(1,+e.target.value) })}
          min={1} required style={{ width: 80, marginRight:5 }}/>
        <button type="submit">Adicionar</button>
      </form>
      <ul style={{ padding: 0 }}>
        {servicos.map((s, idx) => (
          <li key={idx} style={{
            background: '#fafafa', marginBottom: 7, padding: 7, borderRadius: 4
          }}>
            <b>{s.nome}</b> - {s.duracao} min
            <button type="button" onClick={() => remover(idx)} style={{marginLeft:10}}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

