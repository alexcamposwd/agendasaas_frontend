import React from "react";
import styled from "styled-components";

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
            <button onClick={() => onBlockToggle(u._id, u.status)}>
              {u.status === "ativo" ? "Bloquear" : "Liberar"}
            </button>
            <button onClick={() => onDelete(u._id)}>
              Excluir
            </button>
            {onViewAgenda && (
              <button onClick={() => onViewAgenda(u._id)}>
                Ver Agenda
              </button>
            )}
          </Actions>
        </Item>
      ))}
    </List>
  );
}
