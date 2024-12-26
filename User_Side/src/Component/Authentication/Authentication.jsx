import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";

const Authentication = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        password: formData.password,
      });

      if (response.status === 201) {
        alert("SignUp successful!");
        setIsSignUp(false); // Redirect back to Login
      }
    } catch (error) {
      console.error("Error during SignUp:", error);
      alert("SignUp failed. Please try again.");
    }
  };

  // Handle form submission for Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email: formData.email.trim(), // Trim unnecessary spaces
        password: formData.password, // Plain text password
      });

      if (response.data.success) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data
        navigate("/dashboard");
        onAuthSuccess(); // Notify parent of success
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during Login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      {isSignUp ? (
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNo"
            placeholder="Phone Number"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default Authentication;
