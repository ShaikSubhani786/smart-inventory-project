import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

import API_BASE_URL from "../config";
function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required");
      setMessage("");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

     let data = {};

try {
  data = await response.json();
} catch {
  data = {};
}

console.log("Register status:", response.status);
console.log("Register response:", data);

if (!response.ok) {
  let errorMessage = "Registration failed";

  if (typeof data.detail === "string") {
    errorMessage = data.detail;
  } else if (Array.isArray(data.detail)) {
    errorMessage = data.detail
      .map((item) => item.msg)
      .join(", ");
  } else if (data.message) {
    errorMessage = data.message;
  }

  setError(errorMessage);
  setMessage("");
  return;
}

      setMessage("Registration successful");
      setError("");

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to backend");
      setMessage("");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>

        <p>
          Register for Smart Inventory Management
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Register
          </button>
        </form>

        {message && (
          <p className="register-success">
            {message}
          </p>
        )}

        {error && (
          <p className="register-error">
            {typeof error === "string"
              ? error
              : "Registration failed"}
          </p>
        )}

        <p className="login-link">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
