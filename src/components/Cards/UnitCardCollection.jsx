import React, { useEffect, useState } from "react";

import { unitCardData } from "../../data/Data";
import Card from "../Card/UnitCard";
import "./UnitCardCollection.css";
import { api_url } from '../../data/Data';
import { json } from "react-router-dom";


function UnitCardCollection() {
  const userID = localStorage.getItem("userId");

  const [user, setUser] = useState({})

  const [expandedCardId, setExpandedCardId] = useState(null);

  const handleCardClick = (cardId) => {
    setExpandedCardId(cardId === expandedCardId ? null : cardId);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${api_url}/users/${userID}` , {
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

  const getUnitProgress = (unitID, numLessons) => {

    if (user.user?.unit_progress > unitID) 
        return 100;
    
    if (user.user?.unit_progress == unitID)
        return Math.floor((user.user?.lesson_index / numLessons) * 100);
    
    return  0;
};


  return (
      <div className="cards">
        {unitCardData.map((card, id) => {
          return (
            <div className={`card ${getUnitProgress(id, card.numLessons) == 100 ? "completed-unit" : ""}` } key={id}>
              <Card
                title={card.title}
                id={card.id}
                color={card.color}
                description={card.description}
                progress={getUnitProgress(id, card.numLessons)}
                icon={card.icon}
                series={card.series}
                isExpanded={expandedCardId === id}
                onClick={() => handleCardClick(id)}
                
              />
            </div>
          );
        })}
      </div>
  );
}

export default UnitCardCollection;



