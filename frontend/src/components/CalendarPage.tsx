import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import instance from "../axios";

function CalendarPage() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [slotsByDay, setSlotsByDay] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await instance.get("/api/booking/available-dates");
        setAvailableDates(response.data.availableDates);
      } catch (error) {
        console.error("Error fetching available dates", error);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const response = await instance.get("/api/booking/booked-dates");
        setBookedDates(response.data.bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates", error);
      }
    };

    fetchAvailableDates();
    fetchBookedDates();
  }, []);

  useEffect(() => {
    const slotsGroupedByDay: { [key: string]: string[] } = {};
    availableDates.forEach((date) => {
      const day = moment(date).format("YYYY-MM-DD");
      if (!slotsGroupedByDay[day]) {
        slotsGroupedByDay[day] = [];
      }
      slotsGroupedByDay[day].push(date);
    });
    setSlotsByDay(slotsGroupedByDay);
  }, [availableDates]);

  const isDateBooked = (date: string) => {
    const day = moment(date).format("YYYY-MM-DD");
    if (slotsByDay[day]) {
      return slotsByDay[day].every((slot) => bookedDates.includes(slot));
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableDates.map((date) => {
          const { formattedDate, dayOfWeek, monthYear } = formatDate(date);
          return (
            <Link
              key={date}
              to={`/date/${date}`}
              className={`p-2 text-center rounded-md ${
                isDateBooked(date)
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
    </div>
  );
}

export default CalendarPage;
