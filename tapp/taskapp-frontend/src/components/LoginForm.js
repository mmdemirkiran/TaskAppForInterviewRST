import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      navigate("/tasks"); // Başarılı girişten sonra yönlendirme
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed!");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Register ekranına yönlendirme
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleRegisterRedirect} style={{ marginTop: "10px" }}>
        Register
      </button>
    </div>
  );
};

export default LoginForm;
