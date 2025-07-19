import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import GlobalStyle, { themes } from "./styles/GlobalStyle";
import { ThemeProvider } from "styled-components";

// Importações dos seus componentes/páginas (adapte os caminhos conforme sua estrutura)
import LoginForm from "./components/LoginForm";
import AdminLoginForm from "./components/AdminLoginForm";
import UserCalendarPage from "./pages/UserCalendarPage";
import UserConfigPage from "./pages/UserConfigPage";
import UserAppointmentsPage from "./pages/UserAppointmentsPage";
import AdminDashboard from "./components/AdminDashboard";

// Proteção de rota
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [tema, setTema] = useState("light");

  // Cores do tema atual (acesso rápido)
  const theme = themes[tema];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {/* Botão de alternância de tema (fixo topo/dir, mobile-friendly) */}
      <div
        style={{
          position: "fixed",
          right: 10,
          top: 10,
          zIndex: 200,
          background: theme.card,
          boxShadow: "0 2px 12px rgba(90,40,180,0.08)",
          borderRadius: 20,
        }}
      >
        <button
          style={{
            padding: 8,
            fontSize: 19,
            borderRadius: 20,
            background: "none",
            color: theme.primary,
            border: "none",
            width: 40,
            height: 40,
          }}
          onClick={() => setTema(tema === "light" ? "dark" : "light")}
          aria-label="Alternar tema"
        >
          {tema === "light" ? "🌒" : "🌞"}
        </button>
      </div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
                  textAlign: "center",
                  marginTop: 48,
                  padding: "0 10px",
                }}
              >
                <h1
                  style={{
                    background: "linear-gradient(90deg,#F06292,#7C4DFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "2.3em",
                    letterSpacing: "0.04em",
                    marginBottom: 32,
                    fontWeight: 900,
                  }}
                >
                  SaaS Agendador
                </h1>
                <div style={{ marginTop: 24 }}>
                  <Link to="/user">
                    <button
                      style={{
                        display: "block",
                        width: "90vw",
                        maxWidth: 340,
                        margin: "14px auto",
                        fontSize: "1.12em",
                        boxShadow:
                          "0 1px 6px 0 rgba(124,77,255,0.1)",
                      }}
                    >
                      Entrar como Usuário
                    </button>
                  </Link>
                  <Link to="/admin">
                    <button
                      style={{
                        display: "block",
                        width: "90vw",
                        maxWidth: 340,
                        margin: "14px auto",
                        fontSize: "1.12em",
                        background:
                          "linear-gradient(90deg,#8E24AA,#F06292)",
                        boxShadow:
                          "0 1px 6px 0 rgba(240,98,146,0.09)",
                      }}
                    >
                      Entrar como Admin
                    </button>
                  </Link>
                </div>
                <footer
                  style={{
                    color: theme.secondary,
                    textAlign: "center",
                    marginTop: 56,
                    fontSize: "0.99em",
                  }}
                >
                </footer>
              </div>
            }
          />
          <Route path="/user/*" element={<LoginForm />} />
          <Route path="/admin/*" element={<AdminLoginForm />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <UserCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/config/*"
            element={
              <ProtectedRoute>
                <UserConfigPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamentos/*"
            element={
              <ProtectedRoute>
                <UserAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindash/*"
            element={
              <ProtectedRoute>
                <AdminDashboard
                  onLogout={() => {
                    localStorage.removeItem("token");
                    window.location = "/";
                  }}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

