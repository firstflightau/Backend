const FlightBooking = require("../models/flightBooking.model");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const Testimonial = require("../models/testimonial.model");
const Enquiry = require("../models/contact.model");
const { sendEmail } = require("../config/email");
const { AdminBookingMailTemplate } = require("../utils/mailingFunction");

// exports.createBooking = async (req, res) => {
//   const userId = req.user.id; // Assuming the JWT contains the user ID in the `_id` field
//   // console.log(req.user)
//   try {
//     const {} = req.body;

//     // Proceed to create a new user
//     const booking = new FlightBooking({
//       userId,
//       ...req.body,
//     });

//     // Save the new user to the database
//     const savedBooking = await booking.save();

//     await sendEmail(
//       "New Flight Booking",
//       // "it.designo@gmail.com",
//       // "shaanunplugged1234@gmail.com",
//       "firstflight.au@gmail.com",
//       AdminBookingMailTemplate(savedBooking)
//     );

//     res.status(201).send({
//       statusCode: 201,
//       message: "Booking successfully",
//       bookingId: savedBooking._id,
//     });
//   } catch (err) {
//     const errorMsg = err.message || "Unknown error";
//     res.status(500).send({ statusCode: 500, message: errorMsg });
//   }
// };
exports.createBooking = async (req, res) => {
  try {
    // If user is logged in, use their id, otherwise allow guest (null)
    const userId = req.user ? req.user.id : null;

    // Create booking from request body and optional userId
    const booking = new FlightBooking({
      userId,
      ...req.body,
    });

    const savedBooking = await booking.save();

    await sendEmail(
      "New Flight Booking",
      "firstflight.au@gmail.com",
      AdminBookingMailTemplate(savedBooking)
    );

    res.status(201).send({
      statusCode: 201,
      message: "Booking successfully",
      bookingId: savedBooking._id,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.updateBookingPnr = async (req, res) => {
  const userId = req.user.id; // Assuming the JWT contains the user ID in the `_id` field
  // console.log(req.user)

  const bookingId = req.params.id;
  const { pnr } = req.body;

  if (!pnr) {
    return res.status(400).json({
      statusCode: 400,
      message: "PNR is required in the request body",
    });
  }
  try {
    // Find booking and make sure it belongs to the user
    const booking = await FlightBooking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({
        statusCode: 404,
        message: "Booking not found or unauthorized",
      });
    }

    // Update PNR
    booking.status = "success";
    booking.pnr = pnr;
    const updatedBooking = await booking.save();

    await sendEmail(
      "Flight Booking Confirmation.",
      booking.email,
      AdminBookingMailTemplate(updatedBooking)
    );

    res.status(201).send({
      statusCode: 201,
      message: "Booking successfully",
      data: "Ok",
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.getSingleBooking = async (req, res) => {
  const { id } = req.params; // Extracting the ID from the URL
  try {
    const booking = await FlightBooking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Booking not found" });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Booking  fetch successfully",
      data: booking,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.getUserBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = req.query.page || 1;
    const limit = req.query.limit || 50;
    const sorted = { createdAt: -1 };
    const query = {
      userId: userId,
    };

    const booking = await exports.BookingServices(page, limit, sorted, query);

    // console.log(booking);
    if (booking.data.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No booking found for this criteria",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Booking  fetch successfully",
      pagination: booking.pagination,
      data: booking.data,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

//only admin
exports.getAllBookings = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;
    const sorted = { createdAt: -1 };
    const query = {
      // userId:userId
    };

    const booking = await exports.BookingServices(page, limit, sorted, query);

    // console.log(booking);
    if (booking.data.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No booking found for this criteria",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Booking  fetch successfully",
      pagination: booking.pagination,
      data: booking.data,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.BookingServices = async (page, limit, sorted, query) => {
  try {
    const skip = (page - 1) * limit;

    const data = await FlightBooking.find(query)
      .sort(sorted)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get the total count for pagination metadata
    const totalCount = await FlightBooking.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    // Create the pagination object
    const pagination = {
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
    return { data, pagination };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllCountBookingandUsers = async (req, res) => {
  try {
    const totalBooking = await FlightBooking.countDocuments();
    const totalUser = await User.countDocuments({ isAdmin: false });
    const totalSuccessTransaction = await Transaction.countDocuments({
      status: "success",
    });
    const totalTransaction = await Transaction.countDocuments();
    const totalTestimonial = await Testimonial.countDocuments();
    const totalContact = await Enquiry.countDocuments();

    const data = {
      totalBooking,
      totalUser,
      totalTransaction,
      totalSuccessTransaction,
      totalTestimonial,
      totalContact,
    };

    res.status(200).send({
      statusCode: 200,
      message: "Booking, user, and transaction counts retrieved successfully.",
      data: data,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

// new get all booking

// Get All Bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    // Optional: Restrict to admin users only
    // if (!req.user || req.user.role !== "admin") {
    //   return res.status(403).json({
    //     statusCode: 403,
    //     message: "Access denied. Admins only.",
    //   });
    // }

    const bookings = await FlightBooking.find().sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      statusCode: 200,
      message: "All bookings fetched successfully",
      data: bookings,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).json({ statusCode: 500, message: errorMsg });
  }
};

// ✅ Get single booking by ID
exports.getSingleBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await FlightBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    const errorMsg = error.message || "Unknown error occurred";
    res.status(500).json({
      statusCode: 500,
      message: errorMsg,
    });
  }
};
