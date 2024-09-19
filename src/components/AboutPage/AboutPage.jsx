import React, { useState } from "react";
import Logo from "../../assets/images/signableLogo.png";
import TechStack from "../../assets/images/TechStack.png";
import ReactLogo from "../../assets/images/ReactLogo.png";
import FastApiLogo from "../../assets/images/FastApiLogo.png";
import PydanticLogo from "../../assets/images/PydanticLogo.svg";
import SQLLogo from "../../assets/images/SQLLogo.png";
import AWSLogo from "../../assets/images/AWSLogoWide.png";
import SwaggerLogo from "../../assets/images/SwaggerLogo.png";
import OAuthLogo from "../../assets/images/OAuthLogo.png";
import MediaPipeLogo from "../../assets/images/MediaPipe.png";

import { useNavigate } from "react-router-dom";
import "./AboutPage.css";

function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="circle-right"></div>
            
            <header>
            <div className="logo-header">
                    <div onClick={() => { navigate("/home"); }} className="landingg-logo">
                        <img src={Logo} alt="logo" />
                        <div className="team-title">
                            About Us
                        </div>
                    </div>
                </div>
                <div className="nav-links">
                    <div onClick={() => { navigate("/about"); }}> About</div>
                    <div onClick={() => { navigate("/team"); }}> Team</div>
                    <div onClick={() => { navigate("/tutorial"); }}> Tutorial</div>
                </div>
            </header>
            <div className="about-container">
                <div className="about-section">
                    <div className="">
                        <h2>About</h2>
                        <p>Welcome to SignAble, an American Sign Language (ASL) learning application, where learning how to sign is made accessible and fun! Developed as our final capstone project at the University of Utah, our application aims to address the challenges faced by ASL learners by providing a platform that offers interactive lessons and real-time gesture feedback.</p>
                        <h2>Mission</h2>
                        <p>We believe that everyone should have the opportunity to learn ASL easily and effectively. With our application, users can create accounts and dive into interactive lessons tailored to their learning pace and preferences. Whether you're a beginner or looking to improve your ASL skills, our app is designed to support your journey every step of the way.</p>
                    </div>
                        <h2>Technologies</h2>
                        <ul>

                            <div className="item">
                                <img src={ReactLogo} alt="logo" className="Logo" />
                                <p>JavaScript library based on components we used for building our user interfaces</p>
                            </div>
                            <div className="item">
                                <img src={FastApiLogo} alt="logo" className="Logo" />
                                <p>Modern web framework used for building our RESTful API in Python</p>
                            </div>
                            <div className="item">
                                <img src={PydanticLogo} alt="logo" className="Logo" />
                                <p>Data validation library for Python</p>
                            </div>
                            <div className="item">
                                <img src={SQLLogo} alt="logo" className="Logo" />
                                <p>Used to manage our relational database</p>
                            </div>
                            <div className="item">
                                <img src={SwaggerLogo} alt="logo" className="Logo" />
                                <p>Tool used to document and design our APIs</p>
                            </div>
                            <div className="item">
                                <img src={AWSLogo} alt="logo" className="Logo" />
                                <p>Cloud computing platform used to deploy our site</p>
                            </div>
                            <div className="item">
                                <img src={OAuthLogo} alt="logo" className="LogoAWS" />
                                <p className="textRight">Industry standard protocol for authorizing users on our platform</p>
                            </div>

                            <div className="item">
                                <img src={MediaPipeLogo} alt="logo" className="Logo" />
                                <p className="">Facilitaes accurate gesture recognition</p>
                            </div>
                        </ul>
                    {/* </section> */}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
