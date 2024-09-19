import "./Friends.css";
import { useQuery, useQueryClient } from "react-query";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { api_url } from "../../data/Data";
import SideBar from "../SideBar/SideBar"
import React, { useState, useEffect } from "react";

import pfp from "../../assets/images/pfp.png";

function FriendsList() {
    const user_id = localStorage.getItem("userId");
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [successAlert, setSuccessAlert] = useState(false);
    const queryClient = useQueryClient();
    const [units, setUnits] = useState(null)

    const { data: allFriendsData, isLoading: allFriendsLoading, error: allFriendsError } = useQuery({
        queryKey: "allFriends",
        queryFn: () =>
            fetch(`${api_url}/users/${user_id}/myfriends`).then(
                (response) => response.json()
            ),
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${api_url}/units/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",

                    },
                });
                const unitsData = await response.json();
                setUnits(unitsData);
            }
            catch (error) {
                console.log("Error fetching user data: ", error)
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (searchQuery !== "") {
            setShowSearch(true);
        }
    }, [searchQuery]);


    const { data: searchFriendsData, isLoading: searchFriendsLoading, error: searchFriendsError } = useQuery({
        queryKey: ["searchFriends", searchQuery],
        queryFn: () =>
            fetch(`${api_url}/users/${user_id}/friends/?search_query=${searchQuery}`).then(
                (response) => response.json()
            ),
        enabled: searchQuery !== "",
    });

    const handleAddFriendClick = () => {
        setShowSearch(true);
    };
    const handleInputChange = (e) => {
        const { value } = e.target;
        setSearchQuery(value); 
    };

    const handleSearchClose = () => {
        setShowSearch(false);
        setSearchQuery("");
    };

    const handleAddFriend = async (friendId) => {
        try {
            const response = await fetch(`${api_url}/users/friends/add/${user_id}?new_friend_id=${friendId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                setSearchQuery("");
                setShowSearch(false);
                setSuccessAlert(true);
                setTimeout(() => {
                    setSuccessAlert(false);
                }, 3000);

                queryClient.invalidateQueries("allFriends");
            } else {
                console.error("Failed to add friend:", response.statusText);
            }

        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    const handleDeleteFriend = async (friendId) => {
        try {
            const response = await fetch(`${api_url}/users/friends/delete/${user_id}?old_friend_id=${friendId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                queryClient.invalidateQueries("allFriends");
            } else {
                console.error("Failed to delete friend:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };

    if (allFriendsError || searchFriendsError) return <p>Error: {searchFriendsError || allFriendsError}</p>;
    return (
        <div className="HomePage">
            <div className="HomeGlass">
                <SideBar
                />
                <div className="friends-list">

                    <div className="friends-container">
                        <div className="top">
                            <span>
                                <span className="welcome-text">My</span>&nbsp;&nbsp;
                                <span className="exclamation-mark">Friends</span>
                            </span>
                            <button onClick={handleAddFriendClick} className="search-button">
                                <span>Add friend</span>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                       
                        {allFriendsData && allFriendsData.followers ? (
                            <div className="friend-container">
                                {allFriendsData.followers.map((friend) => (
                                    <div key={friend.user_id} className="friend-card">
                                        <div className="profile-picture-container">
                                            <div className="profile-picture">
                                                <img src={pfp} alt="Profile Picture" />
                                            </div>
                                            <h3>{friend.first_name}</h3>

                                        </div>
                                        {units && (
                                            <div className="friend-info">
                                                <p>Username: {friend.username}</p>
                                                <p>Learning ASL since: {new Date(friend.created_at).toDateString()}</p>
                                                {units.units[friend.unit_progress] && (
                                                    <p>
                                                        Currently studying {units.units[friend.unit_progress].description} in Unit #{friend.unit_progress + 1}
                                                    </p>
                                                )}

                                                {friend.unit_progress === units.units.length  && (
                                                      <p>ASL Pro! Finished the course.</p>
                                                )}
                                            </div>
                                        )}
                                        <div className="deleteFriend">
                                            <button onClick={() => handleDeleteFriend(friend.user_id)}>Delete Friend</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ) : (
                            
                            <p>You Have No Friends.</p>
                        )}

                        {showSearch && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <input
                                        type="text"
                                        placeholder="Search for friends..."
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                    />
                                    <button onClick={handleSearchClose}>Close</button>
                                    <div className="search-results">
                                        <h3>Search Results</h3>
                                        {searchFriendsData && searchFriendsData.length > 0 ? (
                                            <div className="friend-container">
                                                {searchFriendsData.map((friend) => (
                                                    <div key={friend.id} className="friend-card">
                                                        <h3>{friend.first_name}</h3>
                                                        <p>Username: {friend.username}</p>
                                                        <div className="add-friend">
                                                            <button onClick={() => handleAddFriend(friend.user_id)}>Add Friend</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No users found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {successAlert && (
                            <div className="success-alert">
                                <strong>Success!</strong> New friend added.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FriendsList;