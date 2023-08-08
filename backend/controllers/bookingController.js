const Booking = require("../models/Booking");

exports.addAvailableDates = async (req, res) => {
  try {
    const { dates } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ message: "Invalid dates array" });
    }

    const allTimeSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];

    const availableDateEntries = dates.flatMap((date) =>
      allTimeSlots.map((timeSlot) => ({
        date,
        timeSlot,
        status: "available",
      }))
    );

    await Booking.insertMany(availableDateEntries);

    res.status(200).json({ message: "Available dates added successfully" });
  } catch (error) {
    console.error("Error adding available dates", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAvailableDates = async (req, res) => {
  try {
    const availableDates = await Booking.distinct("date");
    const availableDatesWithTimeSlots = await Promise.all(
      availableDates.map(async (date) => {
        const availableTimeSlots = await exports.getAvailableTimeSlotsByDate(
          date
        );
        return { date, timeSlots: availableTimeSlots };
      })
    );
    res.status(200).json({ availableDates: availableDatesWithTimeSlots });
  } catch (error) {
    console.error("Error getting available dates", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBookedDates = async (req, res) => {
  try {
    const bookedDates = await Booking.distinct("date", { status: "booked" });
    const bookedDatesWithTimeSlots = await Promise.all(
      bookedDates.map(async (date) => {
        const bookedTimeSlots = await exports.getBookedTimeSlotsByDate(date);
        return { date, timeSlots: bookedTimeSlots };
      })
    );
    res.status(200).json({ bookedDates: bookedDatesWithTimeSlots });
  } catch (error) {
    console.error("Error getting booked dates", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBookedTimeSlots = async (req, res) => {
  try {
    const date = req.params.date;
    const bookedTimeSlots = await exports.getBookedTimeSlotsByDate(date);
    res.status(200).json({ bookedTimeSlots });
  } catch (error) {
    console.error("Error getting booked time slots", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to get booked time slots by date
exports.getBookedTimeSlotsByDate = async (date) => {
  try {
    const bookedTimeSlots = await Booking.find({
      date,
      status: "booked",
    }).distinct("timeSlot");
    return bookedTimeSlots;
  } catch (error) {
    throw error;
  }
};

// Helper function to get available time slots by date
exports.getAvailableTimeSlotsByDate = async (date) => {
  try {
    const allTimeSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];
    const bookedTimeSlots = await exports.getBookedTimeSlotsByDate(date);
    const availableTimeSlots = allTimeSlots.filter(
      (timeSlot) => !bookedTimeSlots.includes(timeSlot)
    );
    return availableTimeSlots;
  } catch (error) {
    throw error;
  }
};

exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const date = req.params.date;
    const bookedTimeSlots = await Booking.find({
      date,
      status: "booked",
    }).distinct("timeSlot");

    const allTimeSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];
    const availableTimeSlots = allTimeSlots.filter(
      (timeSlot) => !bookedTimeSlots.includes(timeSlot)
    );
    res.status(200).json({ availableTimeSlots });
  } catch (error) {
    console.error("Error getting available time slots", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { userId, date, timeSlot } = req.body;

    const existingBooking = await Booking.findOne({
      date,
      timeSlot,
      status: "available",
    });

    if (!existingBooking) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    existingBooking.userId = userId;
    existingBooking.status = "booked";
    await existingBooking.save();

    res.status(200).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.header("UserId");

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    booking.status = "available";
    await booking.save();

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBookedAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.header("UserId");

    const bookedAppointments = await Booking.find({ userId, status: "booked" });

    res.status(200).json({ bookings: bookedAppointments });
  } catch (error) {
    console.error("Error fetching booked appointments", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
