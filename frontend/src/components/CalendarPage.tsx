import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import instance from "../axios";
import { HashLoader } from "react-spinners";

function CalendarPage() {
  const [availableDates, setAvailableDates] = useState<any[]>([]); // Change the type to any[]
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await instance.get("/api/booking/available-dates", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setAvailableDates(response.data.availableDates);
      } catch (error) {
        console.error("Error fetching available dates", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const response = await instance.get("/api/booking/booked-dates", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setBookedDates(response.data.bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates", error);
      }
    };

    fetchAvailableDates();
    fetchBookedDates();
  }, [jwtToken]);

  const isDateBooked = (date: string) => {
    const day = moment(date).format("YYYY-MM-DD");
    const availableDateObj = availableDates.find((dateObj) => {
      return moment(dateObj.date).format("YYYY-MM-DD") === day;
    });

    if (availableDateObj) {
      return availableDateObj.timeSlots.length === 0;
    }

    return false;
  };

  const formatDate = (date: string) => {
    const formattedDate = moment(date).format("D");
    const dayOfWeek = moment(date).format("dddd");
    const monthYear = moment(date).format("MMMM YYYY");
    return { formattedDate, dayOfWeek, monthYear };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">
        Book Appointment
      </h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <HashLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableDates.map((dateObj) => {
            const formattedDate = moment(dateObj.date).format("YYYY-MM-DD");
            const { dayOfWeek, monthYear } = formatDate(dateObj.date);

            const dateIsBooked = isDateBooked(formattedDate);

            return (
              <Link
                key={formattedDate}
                to={`/date/${formattedDate}`}
                className={`p-2 text-center rounded-md ${
                  dateIsBooked
                    ? "bg-gray-400 text-white pointer-events-none"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <div>{formattedDate}</div>
                <div>{dayOfWeek}</div>
                <div>{monthYear}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
