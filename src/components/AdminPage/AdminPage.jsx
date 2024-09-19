import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

import { api_url, AdminDashboardData } from "../../data/Data";

import "./AdminPage.css";

export function AdminPage() {

  const { isAdmin } = useAuth();

  return (
    isAdmin ? 
    <div className="admin-dash-container">
      <AdminDashboard />
    </div>
    :
    <h1 className="loading-icon">
      Loading
    </h1>
  );
}


function DashboardItem( { name } ) {

  return (
    <div className="dash-item">
      <div className="item-name item-component">{name}</div>
      <div className="dash-item-button item-component" onClick={console.log("create!")}>Create</div>
      <div className="dash-item-button item-component" onClick={console.log("modify!")}>Modify</div>
    </div>
  );

}


function DashboardItemContainer() {

  return (
    <div className="dash-item-container">
      {AdminDashboardData.map((item, id) => {
        return (
          <div className="dash-item" key={id}>
            <DashboardItem
              name={item.name} 
            />
          </div>
        )
      })}
    </div>
  );
}


function AdminDashboard() {

  const navigate = useNavigate()
  const handleBackButton = () => navigate('/learn');

  return (
    <div className="admin-dash">
      <div className="back-button" onClick={ handleBackButton }> {'<'} </div>
      <DashboardItemContainer />
    </div>
  );
}

export default AdminPage;
