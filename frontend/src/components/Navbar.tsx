import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const jwtToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 p-4 flex flex-wrap justify-between items-center">
      <h1 className="text-white font-bold text-xl mb-4 md:mb-0 md:mr-4">
        Booking App
      </h1>

      <div className="flex flex-wrap justify-center mb-4 md:mb-0">
        <Link
          to="/calendar"
          className={`text-white text-md hover:underline mr-4 md:mr-8 ${
            !jwtToken ? "pointer-events-none opacity-50" : "" // Disable link if jwtToken is not found
          }`}
        >
          Home
        </Link>
        <Link
          to="/booking-details"
          className={`text-white text-md hover:underline ${
            !jwtToken ? "pointer-events-none opacity-50" : "" // Disable link if jwtToken is not found
          }`}
        >
          Booking Details
        </Link>
      </div>

      {jwtToken ? (
        <button
          className="px-4 py-2 rounded-md bg-red-500 text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <Link to="/" className="px-4 py-2 rounded-md bg-green-500 text-white">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
