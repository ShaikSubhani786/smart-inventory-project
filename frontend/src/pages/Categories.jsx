import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../config";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          data.detail ||
          "Login failed"
        );
        return;
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Smart Inventory</h1>
        <p>Login to continue</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>
          <p>
  Don't have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/register")}
  >
    Register
  </button>
</p>

        </form>

        {message && <p>{message}</p>}

      </div>
    </div>
  );
}

export default Login;
