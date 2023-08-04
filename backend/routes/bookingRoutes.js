const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require('../middleware/Auth');

router.get("/available-dates", bookingController.getAvailableDates);
router.get("/booked-dates", bookingController.getBookedDates);
router.get("/available-time-slots/:date", bookingController.getAvailableTimeSlots);
router.post("/book-appointment", bookingController.bookAppointment);
router.post("/cancel-appointment", bookingController.cancelAppointment);
router.post("/add-available-dates", bookingController.addAvailableDates);
router.get("/booked-appointments", bookingController.getBookedAppointmentsByUser);

module.exports = router;
