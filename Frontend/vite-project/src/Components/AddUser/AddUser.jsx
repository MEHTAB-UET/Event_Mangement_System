import React, { useState } from "react";
import axios from "axios";
import "./AddUser.css";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage("");

    const userData = {
      name,
      email,
      phoneNo,
      password,
    };

    try {
      // Sending a POST request to save user data to MongoDB
      const response = await axios.post(
        "http://localhost:5000/api/users",
        userData
      );
      if (response.status === 201) {
        alert("User added successfully");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setErrorMessage("Error saving user. Please try again.");
    }
  };

  return (
    <div className="addUserContainer">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone No</label>
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
