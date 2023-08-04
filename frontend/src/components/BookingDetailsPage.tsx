import React, { useEffect, useState } from "react";
import moment from "moment";
import instance from "../axios";
import { toast } from "react-toastify";

interface Booking {
  _id: string;
  date: string;
  timeSlot: string;
  status: string;
}

function BookingDetailsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const userId = localStorage.getItem("userId");
  const jwtToken = localStorage.getItem("jwtToken");

  const fetchBookings = async () => {
    try {
      if (userId) {
        const response = await instance.get(
          "/api/booking/booked-appointments",
          {
            headers: {
              Authorization: `Bearer ${userId}`,
            },
          }
        );
        setBookings(response.data.bookings);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching booked appointments", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  const handleCancel = async (bookingId: string) => {
    try {
      console.log("Booking ID:", bookingId);
      if (userId) {
        const selectedBooking = bookings.find(
          (booking) => booking._id === bookingId
        );
        if (!selectedBooking) {
          console.error("Selected booking not found");
          return;
        }
        setSelectedBooking(selectedBooking);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error cancelling appointment", error);
    }
  };

  const confirmCancel = async () => {
    try {
      setShowModal(false);
      if (selectedBooking) {
        const response = await instance.post(
          "/api/booking/cancel-appointment",
          {
            bookingId: selectedBooking._id,
          },
          {
            headers: {
              Authorization: `Bearer ${userId}`,
            },
          }
        );
        toast.success("Appointment cancelled successfully");
        console.log("Appointment cancelled successfully", response.data);
        fetchBookings();
      }
    } catch (error) {
      console.error("Error cancelling appointment", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3 text-center text-blue-500">
        Booking Details
      </h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center">No Appointments Found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-md"
            >
              <div>
                <h3 className="font-bold">
                  {moment(booking.date).format("MMMM D, YYYY")}
                </h3>
                <p>{booking.timeSlot}</p>
              </div>
              {booking.status === "booked" ? (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => {}}
                  className="px-2 py-1 bg-gray-500 text-white rounded-md"
                  disabled
                >
                  Cancelled
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2">Cancel Appointment</h2>
            <p>Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={confirmCancel}
              >
                Yes, Cancel
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

export default BookingDetailsPage;
