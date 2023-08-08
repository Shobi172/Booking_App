import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import instance from "../axios";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";

interface Booking {
  _id: string;
  date: string;
  timeSlot: string;
  status: string;
}

function DateDetailsPage() {
  const { date } = useParams<{ date: string }>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const jwtToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const fetchAvailableTimeSlots = async () => {
    try {
      const response = await instance.get(
        `/api/booking/available-time-slots/${date}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setAvailableTimeSlots(response.data.availableTimeSlots);
    } catch (error) {
      console.error("Error fetching available time slots", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookedTimeSlots = async () => {
    try {
      const response = await instance.get(
        `/api/booking/available-time-slots/${date}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setBookedTimeSlots(response.data.bookedTimeSlots);
    } catch (error) {
      console.error("Error fetching booked time slots", error);
    }
  };

  useEffect(() => {
    fetchAvailableTimeSlots();
    fetchBookedTimeSlots();
  }, [date, jwtToken]);

  const isTimeSlotBooked = (timeSlot: string) => {
    return bookedTimeSlots?.includes(timeSlot);
  };

  const handleBooking = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setShowModal(true);
  };

  const handleBookingConfirmation = async (timeSlot: string) => {
    try {
      if (userId && jwtToken) {
        const response = await instance.post(
          "/api/booking/book-appointment",
          {
            userId,
            date,
            timeSlot,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        toast.success("Appointment booked successfully");
        navigate("/booking-details");
        fetchAvailableTimeSlots();
        fetchBookedTimeSlots();
      }
    } catch (error) {
      console.error("Error booking appointment", error);
      toast.error("Error booking appointment");
    } finally {
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {moment(date).format("MMMM D, YYYY")}
      </h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <HashLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableTimeSlots.map((timeSlot) => (
            <div
              key={timeSlot}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-md"
            >
              <span>{timeSlot}</span>
              {isTimeSlotBooked(timeSlot) ? (
                <button
                  onClick={() => handleBooking(timeSlot)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                  disabled
                >
                  Booked
                </button>
              ) : (
                <button
                  onClick={() => handleBooking(timeSlot)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md"
                >
                  Book
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2">Book Appointment</h2>
            <p>
              Are you sure you want to book the time slot {selectedTimeSlot}?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                onClick={() => handleBookingConfirmation(selectedTimeSlot)}
              >
                Yes, Book
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={closeModal}
              >
                No, Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateDetailsPage;
