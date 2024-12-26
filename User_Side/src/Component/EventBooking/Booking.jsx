import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import this at the top

import {
  Button,
  Card,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  DatePicker,
} from "antd";
import "./Booking.css";
import moment from "moment";

const { Option } = Select;

const Booking = () => {
  const [venues, setVenues] = useState([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [noOfPersons, setNoOfPersons] = useState(1);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [eventDate, setEventDate] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const { state } = useLocation();
  const username = state?.userName || "Guest"; // Get userName from state or default to "Guest"

  const dishes = ["Biryani", "Karahi", "BBQ", "Pulao", "Dessert"];

  // Fetch venues from the database
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/venues");
        setVenues(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
        message.error("Failed to fetch venues");
      }
    };
    fetchVenues();
  }, []);

  const handleBook = (venue) => {
    setSelectedVenue(venue);
    setBookingModalVisible(true);
  };

  const handleFormSubmit = async () => {
    if (!noOfPersons || selectedDishes.length < 3 || !eventDate) {
      return message.error("Please fill all fields correctly");
    }

    // Check if the venue is available on the selected date
    try {
      const response = await axios.post(
        "http://localhost:5000/api/checkAvailability",
        {
          venueId: selectedVenue._id,
          eventDate: moment(eventDate).format("YYYY-MM-DD"),
        }
      );

      if (!response.data.isAvailable) {
        return message.error("Venue is not available on the selected date");
      }

      const totalBill = noOfPersons * selectedVenue.pricePerPerson;
      setBillDetails({
        venue: selectedVenue.name,
        location: selectedVenue.location,
        persons: noOfPersons,
        perPersonRate: selectedVenue.pricePerPerson,
        totalBill,
        eventDate: moment(eventDate).format("YYYY-MM-DD"),
      });

      // Save the event data
      await axios.post("http://localhost:5000/api/bookVenue", {
        venueId: selectedVenue._id,
        venueName: selectedVenue.name,

        username,
        noOfPersons,
        selectedDishes,
        eventDate: moment(eventDate).format("YYYY-MM-DD"),
        totalBill,
        // Include userName here
      });

      setBookingModalVisible(false);
      setBillModalVisible(true);
    } catch (error) {
      console.error("Error during booking:", error);
      message.error("Booking failed, please try again");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Venues</h1>
      {/* <h6>{userName}</h6> */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {venues.map((venue) => (
          <Card
            key={venue._id}
            title={venue.Id}
            bordered
            style={{ width: 300 }}
          >
            <p>Name: {venue.name}</p>
            <p>Location: {venue.location}</p>
            <p>Capacity: {venue.capacity}</p>
            <p>Price Per Person: PKR {venue.pricePerPerson}</p>
            <Button type="primary" onClick={() => handleBook(venue)}>
              Book
            </Button>
          </Card>
        ))}
      </div>

      {/* Booking Form Modal */}
      <Modal
        title={`Book Venue: ${selectedVenue?.name}`}
        visible={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item label="Number of Persons" required>
            <InputNumber
              min={1}
              value={noOfPersons}
              onChange={(value) => setNoOfPersons(value)}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Select Dishes (Choose 5)" required>
            <Select
              mode="multiple"
              placeholder="Select 5 dishes"
              value={selectedDishes}
              onChange={setSelectedDishes}
              style={{ width: "100%" }}
            >
              {dishes.map((dish) => (
                <Option key={dish} value={dish}>
                  {dish}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Event Date" required>
            <DatePicker
              value={eventDate}
              onChange={(date) => setEventDate(date)}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Book
          </Button>
        </Form>
      </Modal>

      {/* Bill Details Modal */}
      <Modal
        title="Booking Summary"
        visible={billModalVisible}
        onCancel={() => setBillModalVisible(false)}
        footer={null}
      >
        <p>
          <strong>Venue:</strong> {billDetails?.venue}
        </p>
        <p>
          <strong>Location:</strong> {billDetails?.location}
        </p>
        <p>
          <strong>Persons Coming:</strong> {billDetails?.persons}
        </p>
        <p>
          <strong>Rate Per Person:</strong> PKR {billDetails?.perPersonRate}
        </p>
        <p>
          <strong>Total Bill:</strong> PKR {billDetails?.totalBill}
        </p>
        <p>
          <strong>Event Date:</strong> {billDetails?.eventDate}
        </p>
      </Modal>
    </div>
  );
};

export default Booking;
