const express = require("express");
const bookingController = require("../controllers/booking.controller");

const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

//base url
//   /api/booking
// router.post("/create", authMiddleware, bookingController.createBooking);
router.post("/create", bookingController.createBooking);

router.patch("/update/:id", authMiddleware, bookingController.updateBookingPnr);

router.get("/single/:id", authMiddleware, bookingController.getSingleBooking);
router.get(
  "/history/user",
  authMiddleware,
  bookingController.getUserBookingHistory
);

// new
router.get(
  "/all",

  bookingController.getAllBookings
);

router.get("/singles/:id", bookingController.getSingleBookingById);

module.exports = router;
