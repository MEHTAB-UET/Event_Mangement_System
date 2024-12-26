import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [venue, setVenue] = useState({
    name: "",
    location: "",
    capacity: "",
    pricePerPerson: "",
    timeAllowed: "",
  });

  const handleVenueChange = (e) => {
    const { name, value } = e.target;
    setVenue({
      ...venue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "/api/venues";
    const data = venue;

    try {
      const response = await axios.post("http://localhost:5000" + url, data);
      console.log("Venue added:", response.data);
      setVenue({
        name: "",
        location: "",
        capacity: "",
        pricePerPerson: "",
        timeAllowed: "",
      });
    } catch (error) {
      console.error("Error adding venue:", error);
    }
  };

  return (
    <div className="window">
      <div className="admin-container">
        <h2>Add New Venue</h2>

        {/* Only Add Venue form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name of Venue:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={venue.name}
              onChange={handleVenueChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={venue.location}
              onChange={handleVenueChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={venue.capacity}
              onChange={handleVenueChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pricePerPerson">Price Per Person:</label>
            <input
              type="number"
              id="pricePerPerson"
              name="pricePerPerson"
              value={venue.pricePerPerson}
              onChange={handleVenueChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeAllowed">Time Allowed (hours):</label>
            <input
              type="number"
              id="timeAllowed"
              name="timeAllowed"
              value={venue.timeAllowed}
              onChange={handleVenueChange}
              required
            />
          </div>
          <button type="submit">Add Venue</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
