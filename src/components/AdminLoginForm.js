import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
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

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    try {
      const res = await api.post("/auth/admin-login", { password });
      localStorage.setItem("token", res.data.token);
      navigate("/admindash");
    } catch {
      setErro("Senha inválida");
    }
  }

  return (
    <form style={{ maxWidth: 300, margin: "50px auto" }} onSubmit={handleLogin}>
      <h2>Login Admin</h2>
      <input
        type="password"
        placeholder="Senha do admin"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12, height: 32 }}
      />
      <Button type="submit" style={{ width: "100%" }}>Entrar</Button>
      {erro && <div style={{color:'red'}}>{erro}</div>}
      <p>
        <Button type="button" onClick={() => navigate("/")} style={{marginTop:12}}>Voltar</Button>
      </p>
    </form>
  );
}

