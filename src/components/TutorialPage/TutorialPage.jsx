import "./TutorialPage.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/signableLogo.png";
import LandingPage from "../../assets/images/landingpage.webp";
import Register from "../../assets/images/Reg.png";
import LogIn from "../../assets/images/LogIn.png";
import Dashboard from "../../assets/images/Dashboard.png";
import Learn from "../../assets/images/Learn.png";
import Profile from "../../assets/images/ProfileDash.png";
import Friends from "../../assets/images/Friends.png";
import Update from "../../assets/images/Update.png";







function TutorialPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="circle-right"></div>
            <header>
                <div className="logo-header">
                    <div onClick={() => { navigate("/home"); }} className="landingg-logo">
                        <img src={Logo} alt="logo" />
                        <div className="team-title">
                            Tutorial
                        </div>
                    </div>
                </div>
                <div className="nav-links">
                    <div onClick={() => { navigate("/about"); }}> About</div>
                    <div onClick={() => { navigate("/team"); }}> Team</div>
                    <div onClick={() => { navigate("/tutorial"); }}> Tutorial</div>
                </div>
            </header>
            <div className="tutorial-container">
                <div className="tutorial-section">
                    <div class="step">
                        <div className="left">
                            <img src={LandingPage} className="side" />
                        </div>

                        <div class="member-info">
                            <h3>#1. Getting Started</h3>
                            <p>
                                Navigate to signable.tv in a web browser.
                                            </p>
                        </div>

                    </div>

                    <div class="step">
                        <div className="left">
                            <img src={LogIn} className="side" />

                        </div>
                        <div class="member-info">
                            <h3>#2. Sign Up Or Log In</h3>
                            <p>
                            If users wish to access the main features, they have the option to sign up or log in. They can find the respective links prominently displayed on the homepage. Upon clicking the sign-up or login button, users are directed to a secure page where they can create a new account or enter their credentials if they already have one. Once logged in, they gain access to our ASL learning platform.                   </p>
                        </div>

                    </div>


                    <div class="step">
                        <div className="left">
                            <img src={Dashboard} className="side" />

                        </div>
                        <div class="member-info">
                            <h3>#3 Dashboard</h3>
                            <p>
                            The dashboard serves as the central hub of the web application, providing users with a comprehensive overview of their account and activities. Upon logging in, users are greeted with a dashboard displaying ASL units, recent activity, sidebar navigation, and daily goals. From here, users can efficiently navigate through various sections of the app, monitor their progress, and access essential tools and features.                        </p>
                        </div>

                    </div>

                    <div class="step">
                        <div className="left">
                            <img src={Learn} className="side" />

                        </div>
                        <div class="member-info">
                            <h3>#4. Learn</h3>
                            <p>
                                
Users can access a variety of ASL units tailored to different skill levels and topics, allowing them to progress at their own pace. Utilizing advanced gesture recognition technology, the feature provides real-time feedback on users' signing accuracy, helping them refine their skills with precision. Additionally, interactive exercises and quizzes further reinforce learning, ensuring comprehensive understanding.
                        </p>
                        </div>

                    </div>

                    <div class="step">
                        <div className="left">
                            <img src={Profile} className="side" />

                        </div>
                        <div class="member-info">
                            <h3>#5. Profile</h3>
                            <p>
                            Accessible via the sidebar navigation, users can easily navigate to their profile to view daily statistics, including streaks and goals. These metrics provide valuable insights into users' performance and achievements over time, motivating them to stay consistent with their goals.                      </p>
                        </div>

                    </div>

                    <div class="step">
                        <div className="left">
                            <img src={Friends} className="side" />

                        </div>
                        <div class="member-info">
                            <h3>#6. Friends</h3>
                            <p>
                            From the sidebar navigation, users can access their friends list to add or remove connections. Within this feature, users can also view their friends' progress in learning American Sign Language (ASL), including their current ASL units, completion status, and start date.                        </p>
                        </div>

                    </div>


                    <div class="step">
                        <div className="left">
                            <img src={Update} className="side" />

                        </div>
                        <div class="member-info">
                            <h3>#7. Update</h3>
                            <p>
                            Accessible from the sidebar navigation, users can easily navigate to their settings page to update their account information. This includes options to edit their profile details such as username, email address, and name.                         </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    );
};

export default TutorialPage;
