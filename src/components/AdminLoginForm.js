import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
      <button type="submit" style={{ width: "100%" }}>Entrar</button>
      {erro && <div style={{color:'red'}}>{erro}</div>}
      <p>
        <button type="button" onClick={() => navigate("/")} style={{marginTop:12}}>Voltar</button>
      </p>
    </form>
  );
}

