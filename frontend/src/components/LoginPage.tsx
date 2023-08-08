import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import instance from "../axios";
import { HashLoader } from "react-spinners";

interface DecodedToken {
  userId: string;
}

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateOTP = (otp: string): boolean => {
    const otpPattern = /^[0-9]{4}$/;
    return otpPattern.test(otp);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    try {
      setIsLoading(true);
      const response = await instance.post("/api/sendOTP", { email });
      if (response.status === 200) {
        toast.success("OTP sent to the user's email!");
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!validateOTP(otp)) {
      setOtpError("Invalid OTP format. Should be a 4-digit number.");
      return;
    }

    try {
      const response = await instance.post("/api/verifyOTP", { email, otp });
      if (response.status === 200 && response.data.token) {
        const token = response.data.token;

        const decodedToken = jwt_decode<DecodedToken>(token);
        const userId = decodedToken.userId;

        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userId", userId);

        toast.success("Login Successfull!");
        navigate("/calendar");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-80">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login Page
        </h1>
        <div className="w-full">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          {emailError && (
            <p className="text-red-500 text-center mb-2">{emailError}</p>
          )}
          {!isLoading && !otpSent ? (
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Send OTP
            </button>
          ) : isLoading ? (
            <div className="flex items-center justify-center">
              <HashLoader color="#36d7b7" size={30} />
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP (4-digit)"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
              {otpError && (
                <p className="text-red-500 text-center mb-2">{otpError}</p>
              )}
              <button
                onClick={handleOTPVerification}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
