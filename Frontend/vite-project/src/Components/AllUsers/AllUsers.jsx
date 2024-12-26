import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllUser.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data); // Set the users state with the fetched data
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Error fetching users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="allUsersContainer">
      <h2>All Users</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="users-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div className="user-card" key={user._id}>
              <h3>{user.name}</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phoneNo}
              </p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
