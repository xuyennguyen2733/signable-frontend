
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonCircleOutline, IoHome, IoPencil, IoStatsChartSharp } from "react-icons/io5";
import SideBar from "../SideBar/SideBar"
import UserUpdate from "../UserUpdate/UserUpdate"
import { useAuth } from "../../context/auth";
import './Settings.css'


function Settings() {

    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(() => {
        return JSON.parse(localStorage.getItem('isDark')) || false;
    });

    const toggleStyles = () => {
        setIsDark((darkMode) => {
            const darkColor = 'slategray';
            const lightColor = 'white';
            if (!darkMode) {
                document.documentElement.style.setProperty('background', darkColor);
                localStorage.setItem('isDark', JSON.stringify(true));
            } else {
                document.documentElement.style.setProperty('background', lightColor);
                localStorage.setItem('isDark', JSON.stringify(false));
            }

            return !darkMode;
        });
    };


    const handleLogout = () => {
        // Handle logout logic
    };

    const handleDeleteAccount = () => {
        // Handle delete account logic
    };

    return (
        <div className="HomePage">
            <div className="HomeGlass">
                <SideBar
                />
                <div className="settings-page">
                    <div className="settings-wrapper">
                        {/* <h1>Application Settings</h1>
                        {isAdmin && (
                            <div className="input-box">
                                <button type="button" onClick={() => {
                                    navigate('/admin');
                                }}>
                                    Site Administration
                                </button>
                            </div>
                        )} */}
                        {/* <div className="input-box">
                    <button
                        type="button"
                        onClick={toggleStyles}
                    >
                        Toggle Dark Mode
                    </button>
                </div> */}
                        <UserUpdate></UserUpdate>
                        {/* <button type="submit" onClick={() => navigate('/updateprofile')}>Update Profile</button> */}

                    </div>
                </div>
            </div>
        </div>

    );
};

export default Settings;
