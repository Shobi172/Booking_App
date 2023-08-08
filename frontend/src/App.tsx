import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import CalendarPage from "./components/CalendarPage";
import DateDetailsPage from "./components/DateDetailsPage";
import BookingDetailsPage from "./components/BookingDetailsPage";
import PageNotFound from "./components/PageNotFound";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("jwtToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/date/:date" element={<DateDetailsPage />} />
        <Route path="/booking-details" element={<BookingDetailsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
