import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

import Logo from "../../assets/images/signableLogo.png";
import { api_url } from "../../data/Data";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login, isLoggedIn } = useAuth();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(`${api_url}/users/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Set correct content type
      },
      body: new URLSearchParams({ username, password }).toString(), // Convert fields to URL-encoded format
    }).then((response) => {
      if (response.ok) {
        // This is for demonstration purposes because my approach to this implementation has been somewhat terrible - Michael
        localStorage.removeItem("lesson1");
        localStorage.removeItem("lesson2");
        localStorage.removeItem("test1");
        localStorage.removeItem("lessonComplete");

        response.json().then(login);
        if (isLoggedIn) navigate("/learn");
      } else {
        // Login failed
        setError("Invalid username or password. Please try again."); // Set error message
      }
    });
  };

  return (
    <>
      <div className="login-page-page">
        <div className="circle-right"></div>
        <div className="login-page-wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <FaLock className="icon" />
            </div>

            {error && <p className="error">{error}</p>}

            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="/recover-password">Forgot Password?</a>
            </div>
            <button className="login-page-sbt" type="submit">
              Login
            </button>
            <div className="login-page-register-link">
              <p>
                Don't have an account? <a href="/signup">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
