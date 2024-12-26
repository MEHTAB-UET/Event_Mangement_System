import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpEvent.css";

const UpEvents = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((response) => {
        console.log("Events fetched:", response.data);
        const upcomingEvents = response.data;
        setEvents(upcomingEvents); // Set filtered events
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div className="upContainer">
      <div className="upcoming-events">
        {/* {console.log("Efetched:", response.data)} */}
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              {console.log("Event:", event)}
              <h3>Name:</h3> {event.username || "Unnamed Event"}
              <h3>No of Guests:</h3>
              <p>{event.noOfPersons || "Unnamed Event"}</p>
              <h3>Location:</h3>
              <p>{event.name || "Location not provided"}</p>
              <h3>Selcted Dishes:</h3>
              {event.selectedDishes.map((dish, index) => (
                <p key={index}>{dish}</p>
              ))}
              <h3>Date:</h3>
              <p>{new Date(event.eventDate).toLocaleDateString()}</p>{" "}
              <h3>Total Bill:</h3>
              <p>{event.totalBill}</p>
            </div>
          ))
        ) : (
          <p>No Upcoming Events....</p>
        )}
      </div>
    </div>
  );
};

export default UpEvents;
