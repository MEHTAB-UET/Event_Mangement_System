import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { state } = useLocation();
  const user = state?.user;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/userEvents?username=${user?.name}`
        );
        setEvents(
          response.data.filter((event) => event.username === user?.name)
        ); // Filter events by matching username
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    if (user?.name) {
      fetchUserEvents();
    }
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
      <div className="user-details">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {user?.phoneNo}
        </p>
      </div>

      <div className="events-section">
        <h2>Booked Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li className="event-card" key={event._id}>
                <p>
                  <strong>Venue:</strong> {event.venueName}
                </p>
                <p>
                  <strong>Event Date:</strong> {event.eventDate}
                </p>
                <p>
                  <strong>No. of Persons:</strong> {event.noOfPersons}
                </p>
                <p>
                  <strong>Selected Dishes:</strong>{" "}
                  {event.selectedDishes.join(", ")}
                </p>
                <p>
                  <strong>Total Bill:</strong> PKR {event.totalBill}
                </p>
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">No events booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
