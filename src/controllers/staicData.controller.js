const {
  AirlineData,
  AirportData,
  MarkUpDiscount,
} = require("../models/staticData.model");
const requestIp = require("request-ip");
const geoip = require("geoip-lite");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.getAirlineDetails = async (req, res) => {
  try {
    const response = await AirlineData.find({}).select("-_id");

    res.status(200).send({
      statusCode: 200,
      message: "Fetch airline list successfully.",
      data: response,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

//search airport Data

exports.getAirportListDevelopment = async (req, res) => {
  try {
    if (!req.query.keyword)
      return res.status(404).send({
        statusCode: 404,
        message: "Please select search term.",
      });

    var regex = new RegExp(`^${escapeRegex(req.query.keyword)}`, "i");
    let response = await AirportData.find({
      $or: [
        { AirportCode: regex },
        { name: regex },
        { state: regex },
        { CountryName: regex },
      ],
    });

    if (response.length === 1) {
      const value = response[0]?.state || response[0]?.CountryCode;
      const addResponse = await AirportData.find({
        $or: [{ state: value }, { CountryCode: value }],
      });
      // response=[...response, ...addResponse]

      response = combineUnique(response, addResponse, "id");
    }
    res.status(200).send({
      statusCode: 200,
      message: "Fetch airport list successfully.",
      data: response,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.getAirportListProduction = async (req, res) => {
  try {
    if (!req.query.keyword)
      return res.status(404).send({
        statusCode: 404,
        message: "Please select search term.",
      });

    const userIP = requestIp.getClientIp(req);
    const userLocation = geoip.lookup(userIP);

    var regex = new RegExp(`^${escapeRegex(req.query.keyword)}`, "i");
    let response = await AirportData.find({
      $or: [
        { AirportCode: regex },
        { name: regex },
        { state: regex },
        { CountryName: regex },
      ],
    });

    if (response.length === 1) {
      const value = response[0]?.state || response[0]?.CountryCode;
      const addResponse = await AirportData.find({
        $or: [{ state: value }, { CountryCode: value }],
      });
      // response=[...response, ...addResponse]

      response = combineUnique(response, addResponse, "id");
    }

    // Sort the search results based on matching country code
    const sortedResponse = response.sort((a, b) => {
      // Replace 'CountryCode' with the actual property in your cityData model representing country code
      const aCountryCode = a.CountryCode.trim().toUpperCase();
      const bCountryCode = b.CountryCode.trim().toUpperCase();
      const userCountryCode = userLocation.country.trim().toUpperCase();

      const aIsMatch = aCountryCode === userCountryCode;
      const bIsMatch = bCountryCode === userCountryCode;

      // Sort by matching country code first, then by other criteria
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;
    });

    res.status(200).send({
      statusCode: 200,
      message: "Fetch airport list successfully.",
      data: sortedResponse,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

const combineUnique = (array1, array2, uniqueKey) => {
  // Create a Set to track unique keys
  const seen = new Set();

  // Create a combined array with unique items
  const uniqueArray = [...array1, ...array2].filter((item) => {
    const key = item[uniqueKey];
    if (seen.has(key)) {
      return false; // Duplicate
    } else {
      seen.add(key);
      return true; // Unique
    }
  });

  return uniqueArray;
};

exports.getAllAirportList = async (req, res) => {
  try {
    const response = await AirportData.find({});
    res.status(200).send({
      statusCode: 200,
      message: "Fetch all airport list successfully.",
      data: response,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

//getMarkUpAndDiscount
// ✅ GET API
exports.getMarkUpAndDiscount = async (req, res) => {
  try {
    const response = await MarkUpDiscount.findOne({});
    if (!response) {
      return res.status(404).send({
        statusCode: 404,
        message: "Markup and discount data not found.",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Fetched markup and discount successfully.",
      data: response,
    });
  } catch (err) {
    res
      .status(500)
      .send({ statusCode: 500, message: err.message || "Unknown error" });
  }
};

// ✅ UPDATE API
exports.updateMarkUpAndDiscount = async (req, res) => {
  const { id } = req.params;

  try {
    const { markup, discount, destinationMarkups } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ statusCode: 400, message: "ID is required." });
    }

    const existingData = await MarkUpDiscount.findById(id);
    if (!existingData) {
      return res
        .status(404)
        .send({ statusCode: 404, message: "Data not found." });
    }

    const updateData = {};

    if (markup) updateData.markup = markup;
    if (discount) updateData.discount = discount;
    if (destinationMarkups) updateData.destinationMarkups = destinationMarkups;

    const updatedData = await MarkUpDiscount.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).send({
      statusCode: 200,
      message: "Markup and discount updated successfully.",
      data: updatedData,
    });
  } catch (err) {
    res
      .status(500)
      .send({ statusCode: 500, message: err.message || "Unknown error" });
  }
};
