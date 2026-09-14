import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from "../config";


function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("user");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {

    e.preventDefault();

    setMessage("");


    try {

      const formData = new URLSearchParams();


      // OAuth2 expects email through
      // the username field

      formData.append(
        "username",
        email
      );


      formData.append(
        "password",
        password
      );


      // Send selected login type
      formData.append(
        "role",
        role
      );


      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: formData,
        }
      );


      const data = await response.json();


      // ---------------------------------------
      // LOGIN FAILED
      // ---------------------------------------

      if (!response.ok) {

        setMessage(
          data.message ||
          data.detail ||
          "Login failed"
        );

        return;
      }


      // ---------------------------------------
      // LOGIN SUCCESS
      // ---------------------------------------

      localStorage.setItem(
        "access_token",
        data.access_token
      );


      navigate(
        "/dashboard"
      );


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      setMessage(
        "Unable to connect to backend"
      );
    }
  };


  return (

    <div className="login-page">

      <div className="login-card">


        <h1>
          Smart Inventory
        </h1>


        <p>
          Login to continue
        </p>


        <form onSubmit={handleLogin}>


          {/* EMAIL */}

          <input
            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            required
          />


          {/* PASSWORD */}

          <input
            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            required
          />


          {/* LOGIN ROLE */}

          <label
            htmlFor="login-role"

            style={{
              display: "block",
              marginTop: "12px",
              marginBottom: "6px",
            }}
          >

            Login As

          </label>


          <select
            id="login-role"

            value={role}

            onChange={(e) =>
              setRole(
                e.target.value
              )
            }

            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          >

            <option value="user">
              User
            </option>


            <option value="admin">
              Admin
            </option>

          </select>


          {/* LOGIN BUTTON */}

          <button type="submit">
            Login
          </button>


          {/* REGISTER */}

          <p>

            Don't have an account?{" "}

            <button
              type="button"

              onClick={() =>
                navigate(
                  "/register"
                )
              }
            >
              Register
            </button>

          </p>


        </form>


        {/* ERROR MESSAGE */}

        {message && (
          <p>
            {message}
          </p>
        )}


      </div>

    </div>
  );
}


export default Login;