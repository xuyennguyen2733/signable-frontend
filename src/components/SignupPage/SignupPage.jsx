import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

import { api_url } from "../../data/Data";
import "./SignupPage.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirm_password) {
        const response = await fetch(`${api_url}/users/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            username: username,
            email: email,
            first_name: first_name,
            last_name: last_name,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          await fetch(`${api_url}/users/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // Set correct content type
            },
            body: new URLSearchParams({ username, password }).toString(), // Convert fields to URL-encoded format
          }).then((response) => {
            if (response.ok) {
              response.json().then(login);
              if (isLoggedIn) navigate("/learn");
            } else {
              // Login failed
              setError("Something went wrong. Please try again"); // Set error message
              clearFields();
            }
          });
        } else {
          // Login failed
          console.log("Signup failed:", data.message);
        }
      } else {
        alert("Passwords don't match");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/error/404");
    }
  };

  return (
    <div className="signup-page">
          <div className="circle-right"></div>
          
      <div className="signup-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="input-row">
            <div className="input-box">
              <input
                type="text"
                placeholder="First Name"
                value={first_name}
                onChange={handleFirstNameChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Last Name"
                value={last_name}
                onChange={handleLastNameChange}
                required
              />
            </div>
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
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm_password}
              onChange={handleConfirmPasswordChange}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
          </div>

          <button type="submit">Sign Up</button>

          <div className="reigster-link">
            <p>
              Already have an account? <a href="/login">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
