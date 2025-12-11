const mongoose = require("mongoose");

// Single flight details schema
const flightDetailSchema = new mongoose.Schema({
  carrier: { type: String, required: true },
  flightNumber: { type: String, required: true }, // frontend: "number"
  departure: {
    location: { type: String, required: true },
    terminal: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
  },
  arrival: {
    location: { type: String, required: true },
    terminal: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
  },
  duration: { type: String },
  distance: { type: Number },
});

// Passenger details schema
const passengerDetailsSchema = new mongoose.Schema({
  bookingReference: { type: String }, // optional unique booking ID
  passengers: [
    {
      type: { type: String, enum: ["ADT", "CHD", "INF"], required: true },
      title: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      gender: { type: String, enum: ["Male", "Female"], required: true },
      dob: { type: Date, required: true },
      passportNumber: { type: String, required: false },
      passportExpiry: { type: Date, required: false },
      passportIssuingCountry: {
        countryCode: { type: String, required: false },
        countryName: { type: String, required: false },
      },
    },
  ],
  contactInfo: {
    email: { type: String, required: true },
    phoneNumber: { type: String },
  },
  flights: {
    Onward: [flightDetailSchema], // ✅ Array of flights
    Return: [flightDetailSchema], // ✅ Array of flights
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PassengerDetails", passengerDetailsSchema);
