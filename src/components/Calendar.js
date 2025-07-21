import React, { useMemo } from "react";
import styled, { css } from "styled-components";

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

// Estilos dos elementos
const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  margin-bottom: 14px;
`;

const DayCell = styled.td`
  width: 14.28%;
  height: 48px;
  text-align: center;
  vertical-align: middle;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  background: ${props => props.filled ? "#d32f2f" : props.today ? "#fff9c4" : "#fff"};
  color: ${props => props.filled ? "#fff" : "#111"};
  border: 2px solid transparent;
  font-weight: ${props => props.today ? "bold" : "normal"};
  transition: 0.2s;
  ${props =>
    props.hasAppt && !props.filled &&
    css`
      border-color: #d32f2f !important;
    `}
  ${props =>
    props.disabled &&
    css`
      opacity: 0.45;
      pointer-events: none;
    `}
`;

const Header = styled.thead`
  background: #eeeeee;
  th {
    font-weight: bold;
    padding: 3px 6px;
  }
`;

const MonthNav = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 6px 0;
  align-items: center;
`;

// Função utilitária para array dos dias de um mês
function getDaysArray(year, month) {
  const dt = new Date(year, month, 1);
  const first = dt.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let arr = [];
  for (let i = 0; i < first; i++) arr.push(null);
  for (let d = 1; d <= daysInMonth; d++) arr.push(d);
  while (arr.length % 7 !== 0) arr.push(null);
  return arr;
}

// Função: retorna true se todos os slots do dia estão ocupados
function dayFilled(appts, horarioAtendimento, servicos) {
  if (!horarioAtendimento || !servicos || servicos.length === 0) return false;
  // Gera grade total de início até o fim do expediente, 15 em 15 min
  const [hin, minin] = horarioAtendimento.inicio.split(":").map(Number);
  const [hfi, minfi] = horarioAtendimento.fim.split(":").map(Number);
  const totalSlots = [];
  let t = hin * 60 + minin;
  const end = hfi * 60 + minfi;
  while (t <= end) {
    totalSlots.push(`${String(Math.floor(t/60)).padStart(2,0)}:${String(t%60).padStart(2,0)}`);
    t += 15;
  }
  // Para cada agendamento, marque os slots que ocupa (pode passar do expediente)
  const ocupados = Array(totalSlots.length).fill(false);
  appts.forEach(a => {
    const idx = totalSlots.indexOf(a.hora);
    if(idx!==-1) {
      const dur = a.servico?.duracao || 0;
      let slotsUsados = Math.ceil(dur/15);
      for(let i=0; i<slotsUsados; i++) {
        if(idx+i<totalSlots.length) ocupados[idx+i] = true;
      }
    }
  });
  // Dia está filled só se todos os slots estão ocupados
  return ocupados.length > 0 && ocupados.every(x=>x);
}

// Componente principal
export default function Calendar({
  year,
  month,
  onMonthChange,
  onDayClick,
  apptMap,         // { "2025-08-11": [agendamentos...] }
  horarioAtendimento,
  servicos,
  todayDate
}) {
  // Mapeamento para facilitar renderização
  const dias = useMemo(() => getDaysArray(year, month), [year, month]);
  const semana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const monthNames = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  // Navegação do mês
  return (
    <div style={{ maxWidth: 410 }}>
      <MonthNav>
        <Button onClick={() => onMonthChange(-1)}>{"<"}</Button>
        <b style={{ fontSize: "1.2em" }}>{monthNames[month]} {year}</b>
        <Button onClick={() => onMonthChange(+1)}>{">"}</Button>
      </MonthNav>
      <Table>
        <Header>
          <tr>
            {semana.map((d, idx) => <th key={idx}>{d}</th>)}
          </tr>
        </Header>
        <tbody>
          {[0,1,2,3,4,5].map(w => (
            <tr key={w}>
              {[0,1,2,3,4,5,6].map(i => {
                const idx = w * 7 + i;
                const d = dias[idx];
                if (!d) return <DayCell key={i} />;
                const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                const apptsDoDia = apptMap?.[iso] || [];
                const temAgend = apptsDoDia.length > 0;
                const filled = dayFilled(apptsDoDia, horarioAtendimento, servicos);
                const today = todayDate === iso;
                let disabled = false;
                // Desabilite datas passadas
                if (todayDate && iso < todayDate) disabled = true;

                return (
                  <DayCell
                    key={i}
                    hasAppt={temAgend}
                    filled={filled}
                    today={today}
                    onClick={() => !disabled && onDayClick(iso)}
                    disabled={disabled}
                  >
                    {d}
                  </DayCell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
