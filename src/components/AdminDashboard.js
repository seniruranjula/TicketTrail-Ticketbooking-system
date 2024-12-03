import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import './CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear authentication data (e.g., tokens) here
    localStorage.removeItem("authToken"); // Adjust according to your auth flow

    // Redirect to login page
    navigate("/login"); // Use navigate to redirect
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="dashboard-nav">
        <Link to="/admin/users" className="nav-link">Manage Users</Link>
        <Link to="/admin/analytics" className="nav-link">View Analytics</Link>
        <Link to="/admin/add-ticket" className="nav-link">Add Ticket</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="dashboard-content">
        <h2>Welcome, Admin!</h2>
        <p>Manage your platform and monitor activities here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
