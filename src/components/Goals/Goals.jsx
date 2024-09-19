import React, { useState, useEffect } from "react";
import { useQuery } from 'react-query';

import "./Goals.css";
import { useApi, useUser } from "../../hooks";


function Goals() {

  const api = useApi();

  const goals = [
    { description: "Complete 1 Lesson!", completed: false },
    { description: "Earn 30 xp!", completed: false },
    { description: "Earn 50 xp!", completed: false },
  ];

  const { data } = useQuery({
    queryKey: ["daily_xp"],
    queryFn: () => (
      api.get(`/users/xp`)
      .then((response) => response.json())
    )
  });

  // this is still jankier than it should be but it'll do
  if (data?.daily_xp) {
    const xp = data.daily_xp;
    if (xp == 0)
    {
      for (let i = 0; i < 3; i++)
        goals[i]["completed"] = false;
    } else {
      if (xp >= 10)
        goals[0]["completed"] = true;
      if (xp >= 30)
        goals[1]["completed"] = true;
      if (xp >= 50)
        goals[2]["completed"] = true;
    }
  }

  return (
    <div className="user-goals">
      <div className="user-goals-container">
      <h2>Daily Goals</h2>
      <div className="goal-item-container">

      {goals.map((goal, id) => (
        <div
          className={`goal-item ${goal.completed ? "completed-goal" : ""}`}
          key={id}
        >
          {goal.description}
        </div>
      ))}
    </div>
    </div></div>
  );

}

export default Goals;

