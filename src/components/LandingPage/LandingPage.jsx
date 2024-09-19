import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/signableLogo.png";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="circle-right"></div>
      <header>
        <div className="landing-logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="nav-links">
          <div onClick={() => { navigate("/about"); }}> About</div>
          <div onClick={() => { navigate("/team"); }}> Team</div>
          <div onClick={() => { navigate("/tutorial"); }}> Tutorial</div>
        </div>
      </header>

      <div className="hero-container">
        <div className="hero">
          <h1 className="title">
            Welcome to <span>SignAble</span>
          </h1>
          <h2 className="sub-title">Learn American Sign Language!</h2>
          <div className="btn-container">
            <div
              className="btn signup-btn"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </div>
            <div
              className="btn login-btn"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </div>

          </div>
        </div>
        <div className="hero-image">
          <img src={Logo} alt="Image" />
        </div>

      </div>
    </div>

  );
};

export default LandingPage;
