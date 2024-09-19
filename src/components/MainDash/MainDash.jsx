import React, { useEffect, useState } from "react";

import UserCard from "../Cards/UserCard";
import UnitCardCollection from "../Cards/UnitCardCollection";
import Goals from "../Goals/Goals";
import { api_url } from "../../data/Data";




import "./MainDash.css";

const MainDash = () => {
  const userID = JSON.parse(localStorage.getItem("userId"));
  const [user, setUser] = useState({})

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
      }
      catch (error) {
        console.log("Error fetching user data: ", error)
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="MainDash">
      <div className="welcome-message"><span>
        Welcome Back,&nbsp;&nbsp;<span>{user.user?.first_name.charAt(0).toUpperCase() + user.user?.first_name.slice(1)}!</span>
      </span></div> 
      <div className="container full-width-container">
        <UnitCardCollection />
      </div>
    </div>
  );
};

export default MainDash;
