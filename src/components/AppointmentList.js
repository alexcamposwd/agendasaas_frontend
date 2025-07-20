import React from "react";
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

// Lista e cards com visual mobile e agradável
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Card = styled.li`
  background: ${({ theme }) => theme.card};
  margin-bottom: 16px;
  padding: 18px 16px;
  border-radius: 13px;
  box-shadow: 0 1px 8px rgba(124,77,255,0.07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
`;

// Info principal do serviço
const MainInfo = styled.div`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 1.15em;
`;

// Tag de status
const Tag = styled.span`
  padding: 1px 10px;
  background: ${({ pago, theme }) => pago ? theme.primary : theme.highlight};
  color: ${({ pago }) => pago ? "#fff" : "#5a237e"};
  border-radius: 5px;
  font-size: 0.95em;
  margin-left: 6px;
  font-weight: 500;
`;

function durToText(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m ? m + "m" : ""}` : `${m}min`;
}

function formatDateBR(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${d}/${m}/${y.slice(-2)}`;
}

export default function AppointmentList({ appointments, onRemove, onStatus, adminView }) {
  if (!appointments.length) return <div style={{textAlign:'center', margin:24}}>Nenhum agendamento encontrado.</div>;
  return (
    <List>
      {appointments.map(appt => (
        <Card key={appt._id}>
          <div>
            <MainInfo>
              {appt.servico?.nome || appt.titulo}
            </MainInfo>
            <div style={{margin: "7px 0 1px 0", fontSize: "1.01em"}}>
              📅 <b>{formatDateBR(appt.data)}</b>
              {"  •  "}
              🕒 <b>{appt.hora}</b>
              {appt.servico?.duracao &&
                <div>
                  Duração: <b>{durToText(appt.servico.duracao)}</b>
                </div>
              }
            </div>
            <div style={{fontSize:"0.95em"}}>
              Cliente: <b>{appt.clienteNome || "-"}</b>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {onRemove && (
              <Button onClick={() => onRemove(appt._id)} style={{background:"#fff", color:"#c2185b", border:"1px solid #ce93d8"}}>Remover</Button>
            )}
          </div>
        </Card>
      ))}
    </List>
  );
}

