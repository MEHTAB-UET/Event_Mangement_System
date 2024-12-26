import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpEvent.css";

const UpEvents = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      // Ensure correct API URL
      .then((response) => {
        const upcomingEvents = response.data.filter(
          (event) => new Date(event.date) > new Date()
        );
        setEvents(upcomingEvents); // Filter events to show only upcoming ones
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div className="upContainer">
      <div className="upcoming-events">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p>{event.location}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No Upcoming Events</p>
        )}
      </div>
    </div>
  );
};

export default UpEvents;
