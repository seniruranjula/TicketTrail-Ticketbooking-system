import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate
import "./CSS/Login.css"; // Updated file name for specificity

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to server
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // If user is admin, navigate to Admin Dashboard
        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "customer") {
          navigate("/customer");
        }
      } else {
        // Show error message if login fails
        setErrorMessage(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred, please try again.");
    }
  };

  const handleBackButtonClick = (e) => {
    e.preventDefault(); // Prevent default action if needed
    navigate("/"); // Navigate back to home
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log in to access your account</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label className="login-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="login-input"
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="login-input"
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-button">Login</button>
          <button onClick={handleBackButtonClick} className="back-button">
            &larr; Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
