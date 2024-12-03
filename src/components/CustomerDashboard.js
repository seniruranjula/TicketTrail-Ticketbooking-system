import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Using useNavigate instead of useHistory
import './CSS/CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear authentication data here, e.g., removing tokens from localStorage
    localStorage.removeItem("authToken");  // Adjust this based on your auth flow

    // Redirect to login page after logout
    navigate("/login");  // Use navigate to redirect
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
      </div>
      
      <div className="dashboard-nav">
        <Link to="/customer/profile" className="nav-link">Profile</Link>
        <Link to="/customer/buy-ticket" className="nav-link">Buy Ticket</Link> {/* New "Buy Ticket" link */}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        <h2>Welcome, Customer!</h2>
        <p>Manage your profile and purchase tickets here.</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
