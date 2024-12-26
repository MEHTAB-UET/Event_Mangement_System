import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const handleViewProfile = () => {
    const userData = localStorage.getItem("user");

    if (userData) {
      navigate("/profile", { state: { user: JSON.parse(userData) } });
    } else {
      console.error("User data is not available in localStorage.");
    }
  };

  // const handleBooking = () => {
  //   navigate("/booking");
  // };

  const handleBooking = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      navigate("/booking", { state: { userName: user.name } });
    } else {
      console.error("User data is not available in localStorage.");
    }
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data (if stored)
    localStorage.removeItem("authToken");
    navigate("/authentication"); // Redirect to the login page
  };

  return (
    <div className="user-dashboard">
      {/* {console.log(user.name)} */}
      <h1>Welcome to Your Dashboard</h1>
      <p>Manage your profile, stay updated with events, and more!</p>
      <div className="dashboard-options">
        <button className="dashboard-btn" onClick={handleViewProfile}>
          View Profile
        </button>
        <button className="dashboard-btn" onClick={handleBooking}>
          Event Booking
        </button>
        <button className="dashboard-btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
