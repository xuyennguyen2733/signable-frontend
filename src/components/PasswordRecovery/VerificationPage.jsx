import { useState, useRef } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRecovery } from "../../context/recovery";

import "./PasswordRecovery.css";

function VerificationPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [inputSquares, setInputSquares] = useState(["", "", "", "", ""]);

  const { setPage, otp } = useRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputOpt = inputSquares.join("");

    if (inputOpt.length === 5) {
      // DOES NOT WORK YET because otp isn't stored in database
      //  await fetch(`${api_url}/users/verify-opt/${inputOpt}`, {
      //  method: "GET",
      //}).then((response) => {
      //  if (response.ok) {
      //    setPage("reset");
      //  } else {
      //    // Login failed
      //    setError("Invalid username or password. Please try again."); // Set error message
      //  }
      //});
      
      if (inputOpt === otp) setPage("reset");
      else setError("Incorrect OTP! Please Try Again");
    } else {
      setError("OTP must have 5 digits!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Verify Your Account</h1>
          <div style={{ margin: "1rem" }}>
            Enter the OTP code sent to your registered email address
          </div>
          <div className="input-box">
            <VerificationField
              inputSquares={inputSquares}
              setInputSquares={setInputSquares}
            />
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
              Verify
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

function VerificationField({ inputSquares, setInputSquares }) {
  const refs = useRef([]);
  const handleOtpChange = (index, value) => {
    const newOtp = [...inputSquares];
    newOtp[index] = value;
    setInputSquares(newOtp);
    if (value && index < inputSquares.length - 1) {
      refs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !inputSquares[index] && index > 0) {
      refs.current[index - 1].focus();
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {inputSquares.map((value, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          style={{
            width: "4rem",
            height: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleOtpChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}

export default VerificationPage;
