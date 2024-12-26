// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";
import Admin from "./Components/Admin/Admin";
import UpEvents from "./Components/Admin/Upcomming/UpEvents";
import AddUser from "./Components/AddUser/AddUser";
import AllUsers from "./Components/AllUsers/AllUsers";
import AllVenues from "./Components/AllVenues/AllVenues";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-event" element={<Admin />} />
        <Route path="/users" element={<AddUser />} />
        <Route path="/upcoming-events" element={<UpEvents />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/all-venues" element={<AllVenues />} />
      </Routes>
    </Router>
  );
};

export default App;
