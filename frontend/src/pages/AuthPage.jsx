import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { login, register } from "../services/auth";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (values) => {
    setMessage(null);
    try {
      const res = mode === "login" ? await login(values) : await register(values);
      localStorage.setItem("token", res.token || "");
      setMessage({ type: "success", text: `${mode} successful` });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Request failed" });
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        {message && <div className={`msg ${message.type}`}>{message.text}</div>}
        <AuthForm mode={mode} onSubmit={handleSubmit} />
        <div className="toggle">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}