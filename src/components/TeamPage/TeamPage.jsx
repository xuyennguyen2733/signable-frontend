import React, { useState } from "react";
import Logo from "../../assets/images/signableLogo.png";
import Michael from "../../assets/images/Michael.jpg";
import Charlie from "../../assets/images/Charlie.jpg";
import Xuyen from "../../assets/images/Xuyen.jpg";
import Rachel from "../../assets/images/Rachel.jpg";
import LinkedInLogo from "../../assets/images/LinkedInLogo.png";


import { useNavigate } from "react-router-dom";
import "./TeamPage.css";

function TeamPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="circle-right"></div>
            <header>
                <div className="logo-header">
                    <div onClick={() => { navigate("/home"); }} className="landingg-logo">
                        <img src={Logo} alt="logo" />
                        <div className="team-title">
                            Our Team
                        </div>
                    </div>
                </div>

                <div className="nav-links">
                    <div onClick={() => { navigate("/about"); }}> About</div>
                    <div onClick={() => { navigate("/team"); }}> Team</div>
                    <div onClick={() => { navigate("/tutorial"); }}> Tutorial</div>
                </div>
            </header>
            <div className="team-member-page">

                <div className="team-member-container">

                    <div className="team-section">

                        <div class="team-member">
                            <div className="left">
                                <img src={Rachel} alt="logo" className="Logo" />
                                <h3>Rachel Albert</h3>
                                <p>rachelmalbert2@gmail.com</p>
                                <a href="https://www.linkedin.com/in/rachel-albert" target="https://www.linkedin.com/in/rachel-albert" class="linkedin-button">
                                    <i class="fab fa-linkedin linkedin-icon"></i> LinkedIn
                                </a>
                            </div>
                            <div class="member-info">
                                <p>
                                    Rachel Albert is an ambitious student with a passion for continuous learning and creating meaningful solutions. Throughout her time at the University of Utah, she has explored various aspects of computing, developing a strong interest in database design, management, and UI/UX design. In addition to her academic pursuits, Rachel has hands-on experience in mobile application development. She created a Sudoku mobile application aimed at teaching users the game of Sudoku while also providing an engaging platform for playing. Over the past two semesters, Rachel has been focusing on the development of SignAble, an innovative American Sign Language learning web application. SignAble serves as a testament to her dedication to advancing accessibility in technology. It provides users with an intuitive platform that strives to significantly enhance ASL learning for individuals from diverse backgrounds. It is with this dedication to making a positive impact that Rachel aspires to pursue a career where she can leverage her skills to develop impactful solutions that help others.
                                </p>
                            </div>
                        </div>

                        <div class="team-member">
                            <div className="left">
                                <img src={Charlie} alt="logo" className="Logo" />
                                <h3>Charles Davis</h3>
                                <p>cf.davis27@gmail.com</p>
                                <a href="linkedin.com/in/cf-davis/" target="linkedin.com/in/cf-davis/" class="linkedin-button">
                                    <i class="fab fa-linkedin linkedin-icon"></i> LinkedIn
                                </a>
                            </div>
                            <div class="member-info">
                                <p>
                                    Charles Davis is a driven computer science student with a special interest in backend development and systems engineering. He is also passionate about computer science
                                    related education- working 2 summers for the University of Utah’s GREAT summer camps teaching introductory CS topics to local middle schoolers, 2 years TAing for the Kahlert School of Computing Introduction to Comp Sci and Software Practice II courses, and 1 year as a private CS tutor. His most recent work, Signable, has been a great experience in how it’s given an opportunity to combine these two interests in one project. His responsibilities for creating Signables API, databases, and deploying the site to the web has allowed him to develop his skills in backend engineering, while the project’s overall goal of introducing beginners to an American Sign Language curriculum has made the project feel like a meaningful and worthwhile endeavor. Graduating with a B.S. in Computer Science in Spring 2024 and currently pursuing a M.S. in Computer Science with a track in Computer Engineering, Charles is eager to find a place in industry where he can contribute his gathered skills while being challenged to learn more.                            </p>
                            </div>
                        </div>


                        <div class="team-member">
                            <div className="left">
                                <img src={Xuyen} alt="logo" className="Logo" />
                                <h3>Xuyen Nguyen</h3>
                                <p>xuyennguyen2733@gmail.com</p>
                                <a href="linkedin.com/in/nltrieuxuyen27" target="linkedin.com/in/nltrieuxuyen27" class="linkedin-button">
                                    <i class="fab fa-linkedin linkedin-icon"></i> LinkedIn
                                </a>
                            </div>
                            <div class="member-info">


                                <p>
                                    Xuyen Nguyen is passionate about integrating technology into education. Her portfolio is packed with personal and academic projects that empower learners, including Typing Practice – a tool that helps Mandarin learners practice typing Chinese characters with the Taiwanese keyboard layout, Class Schedule  – an online calendar for students to log and export their class schedules to pdf files with style, and Signable - a Capstone project that teaches American Sign Language. Graduating with a bachelor’s degree in Computer Science and a certificate in Visual Computing, Xuyen is eager to leverage her expertise and passion to create innovative solutions as a software engineer. With more than 2 years of experience as a software developer on the UMail team within the University of Utah’s IT department, she assisted with migrating thousands of mailboxes across Microsoft’s Exchange Servers, automated hundreds of tasks with PowerShell scripts, and helped maintain and update one of the department’s websites, Webtools. She has also recently started her remote internship as a frontend developer at Bluesky Vietnam Technology Corporation, a tech company based in Vietnam, where she continues to refine her skills and broaden her horizons in the ever-evolving landscape of technology.                             </p>

                            </div>
                        </div>

                        <div class="team-member">
                        <div className="left">
                         
                            <img src={Michael} alt="logo" className="Logo" />
                            <h3>Michael Sullivan</h3>
                            <p>michael.msullivan93@gmail.com</p>
                            <a href="https://www.linkedin.com/in/michael-sullivan-21ab9a127/" target="https://www.linkedin.com/in/michael-sullivan-21ab9a127/" class="linkedin-button">
                                    <i class="fab fa-linkedin linkedin-icon"></i> LinkedIn
                                </a>
                            </div>
                            <div class="member-info">

                           
                                <p>
                                    Michael Sullivan is passionate about tech, as well as helping others learn and providing solutions to large, complex problems that others face in various different industries, primarily medicine. He is interested in applying what he has learned from the University of Utah to help the practice and application of medicine become more efficient and useful for Doctors, Nurses, Lab Technicians, and patients all around the world. Michael’s interests in Computer Science range from AI and Machine Learning, to Scientific Computing, to responsive and modern web development that provides users with a vast array of wonderful experiences that make them want to come back for more.

                                    With these interests, Michael has been able to build a portfolio full of interesting projects, like SignAble - A Web application that helps others learn Sign Language, as well as Chess Master, an application built to help people improve their skills in Chess and learn from their mistakes. In addition to a myriad of experience within the retail and customer service world, Michael will be graduating with his Bachelor’s of Science in Computer Science where he will then combine his relevant experience and step into a role at his current place of work, ARUP Laboratories, a pathology lab that is affiliated with the University of Utah, where he will begin exploring the uses of AI and Machine Learning in the world of medicine as a Software Engineer for their team.
                                </p>
                               
                               
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;