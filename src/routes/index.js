const express = require("express");

const userRoutes = require("./user.routes");
const flightRoutes = require("./flight.routes");
const staticDataRoutes = require("./staticdata.routes");
const testimonialRoute = require("./testimonial.routes");
const contactRoute = require("./contact.route");
const bookingRoutes = require("./booking.routes");
const adminRoutes = require("./admin.routes");

const transactionRoute = require("./transaction.routes");

const router = express.Router();

router.use("/flight", flightRoutes);
router.use("/staticdata", staticDataRoutes);

//transaction

router.use("/transaction", transactionRoute);

// Use the user routes

router.use("/users", userRoutes);
router.use("/booking", bookingRoutes);
router.use("/testimonial", testimonialRoute);
router.use("/contact", contactRoute);



router.use("/admin", adminRoutes)


module.exports = router;
