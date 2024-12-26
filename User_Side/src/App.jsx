import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserDashboard from "./Component/Dashboard/UserDashboard";
import Authentication from "./Component/Authentication/Authentication";
import UpEvents from "./Component/Upcomming/UpEvents";
import Profile from "./Component/Profile/Profile";
import Booking from "./Component/EventBooking/Booking";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <UserDashboard />
            ) : (
              <Navigate to="/authentication" replace />
            )
          }
        />
        <Route
          path="/authentication"
          element={
            <Authentication onAuthSuccess={() => setIsAuthenticated(true)} />
          }
        />
        <Route path="/upcoming-events" element={<UpEvents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
};

export default App;
