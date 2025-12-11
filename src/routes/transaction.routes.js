

const express = require('express');
const transactionController = require('../controllers/transaction.controller');

const {authMiddleware, isAdminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();



//base url
//   /api/transaction/success/:reservationId
// router.post("/create", authMiddleware, transactionController.createTransaction);
router.post("/create", transactionController.createTransaction);

router.get("/success/:reservationId/:bookingId", transactionController.successTransaction);
router.get("/cancel/:reservationId/:bookingId", transactionController.failedTransaction);
router.get("/failed/:reservationId/:bookingId", transactionController.errorTransaction);






module.exports = router;
