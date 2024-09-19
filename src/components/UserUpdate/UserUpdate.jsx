import React, { useState } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { api_url } from '../../data/Data';
import './UserUpdate.css'

function UserUpdate() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${api_url}/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({ 
                    user_id: 0,
                    username: username,
                    first_name: name,
                    last_name: "",
                    email: email,
                    created_at: "",
                    unit_progress: 0,
                    lesson_index: 0,
                }),
            });
            if (response.ok) {
                // Redirect to a new page or update the UI
                
                navigate("/userprofile")
            } else {
                const data = await response.json();
                setError(data.message); // Set error message
            }
        } catch (error) {
            console.error("Update failed:", error.message);
        }
    };

    return (
        // <div className="login-page-page">
            <div className="login-wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Update User</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={handleNameChange}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <FaEnvelope className="icon" />
                    </div>

                    {error && <p className="error">{error}</p>} {/* Render error message */}

                    <button type="submit">Update</button>

                </form>
            </div>
        // </div>
    );
}

export default UserUpdate;
