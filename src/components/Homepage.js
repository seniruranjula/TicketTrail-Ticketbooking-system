import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.navLink}>Home</Link>
      <Link to="/register" style={styles.navLink}>Register</Link>
      <Link to="/login" style={styles.navLink}>Login</Link>
      <Link to="/about" style={styles.navLink}>About Us</Link>
    </nav>
  );
};

const HomePage = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <header style={styles.header}>
        <h1>Welcome to My React Website</h1>
        <p>Your journey to learning React starts here!</p>
      </header>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    padding: "10px",
    backgroundColor: "#007bff",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  },
  header: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "20px",
    borderRadius: "8px",
  },
};

export default HomePage;
