import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRecovery } from "../../context/recovery";

import { api_url } from "../../data/Data";
import "./PasswordRecovery.css";

function ResetPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setPage, username } = useRecovery();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      await fetch(`${api_url}/users/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }), // Convert fields to URL-encoded format
      }).then((response) => {
        if (response.ok) {
          setPage("success");
        } else {
          // Login failed
          setError("Invalid username or password. Please try again."); // Set error message
        }
      });
    } else {
      setError("Passwords don't match!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Reset Your Password</h1>
          <div className="input-box">
            <input
              type="password"
              placeholder="Your New Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              required
            />
            <FaLock className="icon" />
          </div>
          {error && <div className="error">{error}</div>}{" "}
          {/* Render error message */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button style={{ margin: "0.5rem" }} type="submit">
              Reset
            </button>
            <button
              style={{ margin: "0.5rem" }}
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPage;
