import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";
import Logo from "../../assets/images/signableLogo.png";
import FriendsList from "../Friends/Friends";
import { PiSignOutBold } from "react-icons/pi";
import { SidebarData } from "../../data/Data";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../context/auth";

import "./SideBar.css";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selected, setSelected] = useState(() => {
    const storedIndex = localStorage.getItem("selectedTab");
    return storedIndex !== null ? parseInt(storedIndex) : 0;
  });

  const sidebarVariants = {
    true: {
      left: '0'
    },
    false: {
      left: '-60%'
    }
  }

  const handleTabClick = (index) => {
    setSelected(index); // Update the selected state when a tab is clicked
    localStorage.setItem("selectedTab", index);

    if (index === 0) {
      navigate("/learn");
    } else if (index === 1) {
      navigate("/UserProfile");
    } else if (index === 2) {
      navigate("/friends");
    } else if (index === 3) {
      navigate("/settings");
    }
  };
  return (
    <>
      <div
        className="side-bar"
      >

        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            Sign<span>A</span>ble
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => handleTabClick(index)}
                className={selected === index ? "menuItem active" : "menuItem"}
  
              >
                <item.icon />
                <span>{item.heading}</span>
              </div>
            );
          })}
          <div className="menuItem logoutButton">
            <PiSignOutBold style={{ fontSize: "2rem" }} onClick={logout} />
          </div>
        </div>
      </div>
    </>

  );
};

export default Sidebar;
