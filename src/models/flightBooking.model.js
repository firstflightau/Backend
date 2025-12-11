const mongoose = require("mongoose");

const passengerDetailsSchema = new mongoose.Schema(
  {
    title: String,
    firstName: String,
    lastName: String,
    dob: String,
    gender: String,
    passportNumber: String,
    passportExpire: String,
    passportIssueCountry: String,
    paxType: String,
    amount: Number,
    ticketNumber: String,
  },
  { _id: false }
);

const airlineDetailsSchema = new mongoose.Schema(
  {
    departure: {
      location: String,
      date: String,
      time: String,
      terminal: String,
    },
    arrival: {
      location: String,
      date: String,
      time: String,
      terminal: String,
    },
    duration: String,
    carrier: String,
    number: String,
  },
  { _id: false }
);

const flightBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pnr: {
      type: String,
      default: "NA",
      required: true,
    },
    totalAmount: Number,
    markup: Number,
    email: String,
    phoneNumber: String,
    onward: {
      origin: String,
      destination: String,
      airlineDetails: [airlineDetailsSchema],
    },
    return: {
      origin: String,
      destination: String,
      airlineDetails: [airlineDetailsSchema],
    },
    passengerDetails: [passengerDetailsSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "success"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "failed", "success", "cancel"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FlightBooking = mongoose.model("flightbooking", flightBookingSchema);

module.exports = FlightBooking;
