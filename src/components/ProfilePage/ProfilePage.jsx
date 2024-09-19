import React, { useEffect, useState } from "react";
import { api_url } from "../../data/Data";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaHandsWash, FaHandSparkles } from "react-icons/fa";
import { FaCheckCircle, FaFire } from 'react-icons/fa';
import SideBar from "../SideBar/SideBar"

import "./ProfilePage.css";
import { useQuery } from "react-query";
import { useApi } from "../../hooks";


function ProfilePage() {
    const userID = JSON.parse(localStorage.getItem("userId"));
    const api = useApi();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${api_url}/users/${userID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.log("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [userID]);

    const { data } = useQuery({
      queryKey: ["daily_xp"],
      queryFn: () => (
        api.get(`/users/xp`)
        .then((response) => response.json())
      )
    });

    if (!user || !data) {
        return <div className="loading">Loading...</div>;
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
    }).format(new Date(user.user.created_at));

    const dayPlural = user.user.days_logged != 1 ? "Days" : "Day"
    const iconSize = 40;

    return (
        <div className="HomePage">
            <div className="HomeGlass">
                <SideBar
                />
                <div className="user-profile-page">
                    <div className="user-profile-container">
                        <div className="profile-info">
                            <h1 className="profile-header">{user.user.first_name}</h1>
                            <p><strong>Username:</strong> {user.user.username}</p>
                            <p><strong> Email:</strong> {user.user.email}</p>
                            <p><strong> Learner Since:</strong> {formattedDate}</p>
                        </div>
                        <div className="user-statistics">
                            <h3><IoStatsChartSharp style={{ color: "teal" }} size={iconSize} /> User Statistics</h3>
                            <p><FaFire style={{ color: '#EBAB33' }} size={iconSize} /><strong> Days Spent Learning:</strong> {user.user.days_logged} {dayPlural}</p>
                            <p><FaCheckCircle style={{ color: '#28a745' }} size={iconSize} /><strong> Units Completed:</strong> {user.user.unit_progress}</p>
                            <p><FaHandsWash style={{ color: 'blue' }} size={iconSize} /><strong> Today's XP:</strong> {data.daily_xp}</p>
                            <p><FaHandSparkles style={{ color: 'red' }} size={iconSize} /><strong> Total XP:</strong> {data.total_xp}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProfilePage;