// controllers/metadata.controller.js
const MetaData = require("../models/metadata.model");

/**
 * @desc   Create or Update MetaData for a specific page
 * @route  POST /api/metadata
 * @access Private (Admin)
 */
const upsertMetaData = async (req, res) => {
  const {
    page,
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
  } = req.body;

  if (!page) {
    return res.status(400).json({ message: "Page identifier is required" });
  }

  try {
    const filter = { page: page.toLowerCase() };
    const updateData = {
      page: page.toLowerCase(),
      title,
      description,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage,
    };

    // This is the "upsert" logic you requested.
    // It finds a document by 'page' and updates it,
    // or if it doesn't exist, it creates a new one.
    const metaData = await MetaData.findOneAndUpdate(filter, updateData, {
      new: true, // Return the modified document
      upsert: true, // Create a new doc if no match is found
      runValidators: true,
    });

    res.status(200).json({
      status: 200,
      message: `Metadata for '${page}' saved successfully`,
      data: metaData,
    });
  } catch (err) {
    console.error("Error upserting metadata:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * @desc   Get MetaData for a specific page
 * @route  GET /api/metadata/:page
 * @access Private (Admin)
 */
const getMetaDataByPage = async (req, res) => {
  const { page } = req.params;

  try {
    const metaData = await MetaData.findOne({ page: page.toLowerCase() });

    if (!metaData) {
      // We don't send 404, just an empty object.
      // This allows the frontend to show an empty form for a new page.
      return res.status(200).json({
        status: 200,
        message: "No metadata found for this page, ready to create.",
        data: { page }, // Send back the page name
      });
    }

    res.status(200).json({
      status: 200,
      message: "Metadata fetched successfully",
      data: metaData,
    });
  } catch (err) {
    console.error("Error fetching metadata:", err.message);
    res.status(500).send("Server error");
  }
};

// ... (keep your existing upsertMetaData and getMetaDataByPage functions)

/**
 * @desc   Get all MetaData for the public website
 * @route  GET /api/metadata
 * @access Public
 */
const getAllMetaData = async (req, res) => {
  try {
    const allMetaData = await MetaData.find();

    if (!allMetaData || allMetaData.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No metadata found",
        data: {},
      });
    }

    // Convert the array [ {page: 'home', ...}, {page: 'about', ...} ]
    // into an object { home: {...}, about: {...} }
    // This makes it much easier to look up data in Redux on the frontend
    const formattedMetaData = allMetaData.reduce((acc, item) => {
      acc[item.page] = item;
      return acc;
    }, {});

    res.status(200).json({
      status: 200,
      message: "All metadata fetched successfully",
      data: formattedMetaData,
    });
  } catch (err) {
    console.error("Error fetching all metadata:", err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  upsertMetaData,
  getMetaDataByPage,
  getAllMetaData, // <-- Add this export
};
