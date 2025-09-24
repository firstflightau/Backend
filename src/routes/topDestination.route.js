const express = require("express");
const multer = require("multer");
const topDestinationController = require("../controllers/topDestination.controller");
const upload = require("../config/multerConfig");

const router = express.Router();
//base url
//   /api/topdestination

router.post(
  "/",
  upload.single("image"),
  topDestinationController.createTopDestination
);
router.get("/", topDestinationController.getTopDestination);
router.delete("/:id", topDestinationController.deleteTopDestination);

module.exports = router;
