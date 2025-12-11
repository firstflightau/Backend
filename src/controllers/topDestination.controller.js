const TopDestination = require("../models/topDestination.model");

//create top destination
exports.createTopDestination = async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    // Cloudinary URL from the uploaded image
    const imageUrl = req.file.path; // Cloudinary image URL
    // console.log("Uploaded image URL:", imageUrl);
    // return;

    const { tripData } = req.body;
    console.log("Received tripData:", tripData);
    // Parse the tripData JSON string into an actual object
    const parsedTripData = JSON.parse(tripData);

    if (!Array.isArray(parsedTripData)) {
      return res.status(400).json({ message: "tripData must be an array" });
    }

    const newTopDestination = new TopDestination({
      image: imageUrl,
      from: parsedTripData[0]?.from,
      to: parsedTripData[0]?.to,
    });
    const savedDestination = await newTopDestination.save();

    res.status(200).send({
      statusCode: 200,
      message: "Fetch airline list successfully.",
      data: savedDestination,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.getTopDestination = async (req, res) => {
  try {
    const routes = await TopDestination.find().sort({ createdAt: -1 });

    if (routes.length === 0) {
      return res.status(404).json({ message: "No top route flights found" });
    }

    res.status(200).json({
      status: 200,
      message: "All top Destination flights",
      routes,
    });
  } catch (error) {
    console.error("Error retrieving top destination flights:", error.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTopDestination = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await TopDestination.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Top route not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Top Destination deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting top destination:", error.message);
    res.status(500).send("Server error");
  }
};
