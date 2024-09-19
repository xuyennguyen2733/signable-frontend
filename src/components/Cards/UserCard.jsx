import React from "react";
import { useQuery } from "react-query";

import { api_url } from "../../data/Data"
import Cards from "./UnitCardCollection";

function UserCard({ userId }) {
  const { data, isLoading, error } = useQuery(["user", userId], () =>
    fetch(`${api_url}/users/${userId}`).then((res) => res.json())
  );

  if (isLoading) return <p>Loading user information...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
        <h2>Welcome, {data.user.first_name}!</h2>
        <Cards />
      <h2>User Information</h2>
      <p>Username: {data.user.username}</p>
      <p>Unit Progress: {data.user.unit_progress}</p>
      <p>Current Lesson Index: {data.user.lesson_index}</p>
    </div>
  );
};

export default UserCard;