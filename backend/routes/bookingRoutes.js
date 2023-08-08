const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require('../middleware/Auth');

router.get("/available-dates", authMiddleware, bookingController.getAvailableDates);
router.get("/booked-dates", authMiddleware,  bookingController.getBookedDates);
router.get("/available-time-slots/:date", authMiddleware,  bookingController.getAvailableTimeSlots);
router.post("/book-appointment", authMiddleware,  bookingController.bookAppointment);
router.post("/cancel-appointment", authMiddleware,  bookingController.cancelAppointment);
router.post("/add-available-dates", authMiddleware,  bookingController.addAvailableDates);
router.get("/booked-appointments", authMiddleware,  bookingController.getBookedAppointmentsByUser);

module.exports = router;
