import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRecovery } from "../../context/recovery";

import { api_url } from "../../data/Data";
import "./PasswordRecovery.css";

function RequestPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setPage, setOtp, setUsername, username } = useRecovery();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${api_url}/users/request-recovery/${username}`, {
      method: "PUT",
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setOtp(data.otp);
          setPage("verification");
        });
      } else {
        // Login failed
        setError("Invalid username or password. Please try again."); // Set error message
      }
    });
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Request Password Change</h1>
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
              Send Request
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

export default RequestPage;
