import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Card com responsividade e visual bonito
const Card = styled.form`
  background: ${({ theme }) => theme.card};
  border-radius: 18px;
  margin: 38px auto 0 auto;
  box-shadow: 0 2px 16px rgba(130,40,180,0.09);
  padding: 24px 18px 20px 18px;
  max-width: 390px;
  width: 94vw;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 12px;
  text-align: center;
  font-size: 2em;
`;

const Input = styled.input`
  font-size: 1.09em;
  padding: 11px 12px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border: 1.3px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  margin-bottom: 3px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  font-size: 1em;
  margin-top: 6px;
  margin-bottom: 4px;
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary} 94%);
  color: #fff;
  font-weight: bold;
  border: none;
  box-shadow: 0 1px 6px 0 rgba(124,77,255,0.09);
  transition: filter 0.18s;
  &:active { filter: brightness(0.92);}
`;

const ErrorMsg = styled.div`
  color: #e53935;
  background: #fff0f1;
  padding: 7px 0;
  margin: 5px 0 7px 0;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
`;

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();
    setErro("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setErro("Login inválido");
    }
  };

  return (
    <Card onSubmit={handleLogin}>
      <Title>Login</Title>
      <Input
        name="email"
        type="email"
        autoComplete="username"
        placeholder="E-mail"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        name="senha"
        type="password"
        autoComplete="current-password"
        placeholder="Senha"
        value={form.senha}
        onChange={handleChange}
        required
      />
      <Button type="submit">Entrar</Button>
      {erro && <ErrorMsg>{erro}</ErrorMsg>}
      <Button type="button" onClick={() => navigate("/")}>Voltar</Button>
    </Card>
  );
}
