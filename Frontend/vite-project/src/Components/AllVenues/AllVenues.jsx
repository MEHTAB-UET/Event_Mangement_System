import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllVenues.css";

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch venues data when the component mounts
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/venues");
        setVenues(response.data); // Set the venues state with the fetched data
      } catch (error) {
        console.error("Error fetching venues:", error);
        setErrorMessage("Error fetching venues. Please try again.");
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="allVenuesContainer">
      <h2>All Venues</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="venues-list">
        {venues.length > 0 ? (
          venues.map((venue) => (
            <div className="venue-card" key={venue._id}>
              <h3>{venue.name}</h3>
              <p>
                <strong>Location:</strong> {venue.location}
              </p>
              <p>
                <strong>Capacity:</strong> {venue.capacity}
              </p>
              <p>
                <strong>pricePerPerson:</strong> {venue.pricePerPerson}
              </p>
            </div>
          ))
        ) : (
          <p>No venues found</p>
        )}
      </div>
    </div>
  );
};

export default AllVenues;
