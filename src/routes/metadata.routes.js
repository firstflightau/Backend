// routes/metadata.route.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware"); // Assuming this path
const {
  upsertMetaData,
  getMetaDataByPage,
  getAllMetaData,
} = require("../controllers/metadata.controller");

// Route to create or update metadata (the "submit" button)
// We use authMiddleware because only admin should do this
router.post("/", upsertMetaData);
router.get("/", getAllMetaData);
// Route to get existing metadata for a page (to fill the form)
// We use authMiddleware here too
router.get("/:page", getMetaDataByPage);

module.exports = router;
