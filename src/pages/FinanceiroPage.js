import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

// Formata períodos
function formataPeriodo(r) {
  if (typeof r === "string" && r.length === 10) {
    const [y, m, d] = r.split("-");
    return `${d}/${m}/${y.slice(-2)}`;
  }
  if (typeof r === "string" && r.length === 7) {
    const [y, m] = r.split("-");
    return `${m}/${y.slice(-2)}`;
  }
  if (typeof r === "object" && r.semana && r.ano) {
    return `Semana ${r.semana} de ${r.ano}`;
  }
  return r;
}

export default function FinanceiroPage() {
  const [dados, setDados] = useState([]);
  const [periodo, setPeriodo] = useState("mes");
  const [servico, setServico] = useState("todos");
  const [servicosList, setServicosList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServicos() {
      const res = await api.get("/users/config/servicos");
      setServicosList(res.data || []);
    }
    fetchServicos();
  }, []);

  async function fetch() {
    try {
      const res = await api.get("/appointments/financeiro", {
        params: { periodo, servico }
      });
      setDados(res.data);
    } catch (e) {
      setDados([]);
    }
  }

  useEffect(() => { fetch(); }, [periodo, servico]);

  function sair() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 600, margin: "25px auto" }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/dashboard"><button style={{marginRight:7}}>Calendário</button></Link>
        <Link to="/config"><button style={{marginRight:7}}>Configurar Serviços</button></Link>
        <Link to="/agendamentos"><button>Agendamentos</button></Link>
        <Link to="/financeiro"><button>Financeiro</button></Link>
        <button onClick={sair} style={{ float: "right" }}>Sair</button>
      </nav>
      <h2>Relatório Financeiro</h2>
      <div style={{ marginBottom: 20 }}>
        <select value={periodo} onChange={e => setPeriodo(e.target.value)} style={{ marginRight: 7 }}>
          <option value="dia">Por Dia</option>
          <option value="semana">Por Semana</option>
          <option value="mes">Por Mês</option>
        </select>
        <select value={servico} onChange={e => setServico(e.target.value)} style={{ marginRight: 7 }}>
          <option value="todos">Todos Serviços</option>
          {servicosList.map((s, idx) => (
            <option key={idx} value={s.nome}>{s.nome}</option>
          ))}
        </select>
        <button onClick={fetch} style={{marginLeft:12}}>Atualizar</button>
      </div>
      <table width="100%" border="1" cellPadding={7}>
        <thead>
          <tr>
            <th>Período</th>
            <th>Recebido (pago)</th>
            <th>Em aberto</th>
            <th>Qtd agendamentos</th>
            <th>Serviços</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((r, idx) => (
            <tr key={idx}>
              <td>{formataPeriodo(r.periodo)}</td>
              <td style={{ fontWeight: 'bold', background: "#d7f9d2" }}>{Number(r.pago || 0).toFixed(2)}</td>
              <td style={{ background: "#ffe7bc" }}>{Number(r.aberto || 0).toFixed(2)}</td>
              <td>{r.count}</td>
              <td>
                {Array.from(new Set(r.agendamentos.map(a => a.servico?.nome)))
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
          ))}
          {dados.length === 0 && (
            <tr>
              <td colSpan={5}>Nenhum registro financeiro</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

