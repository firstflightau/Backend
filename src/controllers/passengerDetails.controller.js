const PassengerDetails = require("../models/passengerDetails.model");
// const { v4: uuidv4 } = require("uuid");

// Save passenger details
exports.savePassengerDetails = async (req, res) => {
  try {
    const { passengers, contactInfo, selectedFlight } = req.body;

    if (!passengers || !contactInfo || !selectedFlight) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Map flights into schema format
    const mapFlights = (flightsArray = []) =>
      flightsArray.map((f) => ({
        carrier: f.carrier,
        flightNumber: f.number, // frontend field is "number"
        departure: {
          location: f.Departure?.location,
          terminal: f.Departure?.terminal,
          date: f.Departure?.date,
          time: f.Departure?.time,
        },
        arrival: {
          location: f.Arrival?.location,
          terminal: f.Arrival?.terminal,
          date: f.Arrival?.date,
          time: f.Arrival?.time,
        },
        duration: f.duration,
        distance: f.distance,
      }));

    const passengerDetails = new PassengerDetails({
      passengers,
      contactInfo,
      flights: {
        Onward: mapFlights(selectedFlight.Onward?.flights),
        Return: mapFlights(selectedFlight.Return?.flights || []), // ✅ fallback for one-way trips
      },
    });

    await passengerDetails.save();

    res.status(201).json({
      success: true,
      message: "Passenger details saved successfully",
      data: passengerDetails,
    });
  } catch (error) {
    console.error("Error saving passenger details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save passenger details",
      error: error.message,
    });
  }
};

// Get all passenger details (for admin)
exports.getAllPassengerDetails = async (req, res) => {
  try {
    const passengerDetails = await PassengerDetails.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: passengerDetails.length,
      data: passengerDetails,
    });
  } catch (error) {
    console.error("Error fetching passenger details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch passenger details",
      error: error.message,
    });
  }
};

// Get passenger details by booking reference
// exports.getPassengerDetailsByReference = async (req, res) => {
//   try {
//     const { bookingReference } = req.params;

//     const passengerDetails = await PassengerDetails.findOne({
//       bookingReference,
//     });

//     if (!passengerDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: passengerDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching passenger details:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch passenger details",
//       error: error.message,
//     });
//   }
// };
