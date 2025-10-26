// models/metadata.model.js
const mongoose = require("mongoose");

const metaDataSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true, // This ensures one document per page
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    keywords: {
      type: String, // Stored as a comma-separated string
      trim: true,
    },
    canonical: {
      type: String, // The canonical URL
      trim: true,
    },
    ogTitle: {
      type: String, // Open Graph Title
      trim: true,
    },
    ogDescription: {
      type: String, // Open Graph Description
      trim: true,
    },
    ogImage: {
      type: String, // URL to Open Graph Image
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MetaData", metaDataSchema);
