import React, { useState } from "react";

export default function AuthForm({ mode = "login", onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "register" && (
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
      )}
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Password
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}