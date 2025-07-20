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

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  background: #f9f9f9;
  margin-bottom: 10px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export default function UserList({ users, onBlockToggle, onDelete, onViewAgenda }) {
  if (!users.length) return <div>Nenhum usuário cadastrado.</div>;

  return (
    <List>
      {users.map(u => (
        <Item key={u._id}>
          <div>
            <b>{u.nome}</b> ({u.email}) — <span style={{
              color: u.status === "ativo" ? "green" : "red"
            }}>{u.status}</span>
          </div>
          <Actions>
            <Button onClick={() => onBlockToggle(u._id, u.status)}>
              {u.status === "ativo" ? "Bloquear" : "Liberar"}
            </Button>
            <Button onClick={() => onDelete(u._id)}>
              Excluir
            </Button>
            {onViewAgenda && (
              <Button onClick={() => onViewAgenda(u._id)}>
                Ver Agenda
              </Button>
            )}
          </Actions>
        </Item>
      ))}
    </List>
  );
}
