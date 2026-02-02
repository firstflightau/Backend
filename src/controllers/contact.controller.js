// require("dotenv").config();
// const Enquiry = require("../models/contact.model");
// const User = require("../models/user.model");

// // Add a new testimonial
// const enquiry = async (req, res) => {
//   const { firstName, lastName, phone, email, message, date } = req.body;

//   const userId = req.user.id;

//   try {
//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const newEnquiry = new Enquiry({
//       firstName,
//       lastName,
//       phone,
//       message,
//       date,
//       email,
//     });

//     const enquiry = await newEnquiry.save();

//     res.status(200).json({
//       status: 200,
//       message: "enquiry sent successfully",
//       enquiry,
//     });
//   } catch (err) {
//     console.error("Error adding enquiry:", err.message);
//     res.status(500).send("Server error");
//   }
// };

// // Get all testimonials
// const getAllEnquiry = async (req, res) => {
//   try {

//     const sorted = { createdAt: -1 };
//     const enquiry = await Enquiry.find().sort(sorted);
//     if (enquiry.length === 0) {
//       return res.status(404).json({ message: "No enquiry found" });
//     }
//     res.status(200).json({
//       status: 200,
//       message: "All enquiries",
//       enquiry,
//     });
//   } catch (err) {
//     console.error("Error retrieving testimonials:", err.message);
//     res.status(500).send("Server error");
//   }
// };

// module.exports = { enquiry, getAllEnquiry };
const Enquiry = require("../models/contact.model");

// Add enquiry (PUBLIC API)
const enquiry = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, message } = req.body;

    if (!firstName || !lastName || !phone || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEnquiry = new Enquiry({
      firstName,
      lastName,
      phone,
      email,
      message,
    });

    const savedEnquiry = await newEnquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry sent successfully",
      enquiry: savedEnquiry,
    });
  } catch (error) {
    console.error("Enquiry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all enquiries (Admin / panel use)
const getAllEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { enquiry, getAllEnquiry };
