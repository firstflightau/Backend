const mongoose = require("mongoose");

const topDestinationSchema = new mongoose.Schema(
  {
    from: {
      type: Object,
      required: true,
    },
    to: {
      type: Object,
      required: true,
    },
    image: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const TopDestination = mongoose.model("TopDestination", topDestinationSchema);

module.exports = TopDestination;
