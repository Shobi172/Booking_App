const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/Auth');

router.post("/sendOTP", userController.sendOTP);
router.post("/verifyOTP", userController.verifyOTP);

module.exports = router;
