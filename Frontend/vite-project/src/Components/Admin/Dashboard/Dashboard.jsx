// Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Add styles for buttons

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="button-container">
        <Link to="/add-event" className="button">
          Add Venue
        </Link>
        <Link to="/users" className="button">
          Add Users
        </Link>
        <Link to="/upcoming-events" className="button">
          Upcoming Events
        </Link>
        <Link to="/all-users" className="button">
          All Users
        </Link>
        <Link to="/all-venues" className="button">
          All Venues
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
