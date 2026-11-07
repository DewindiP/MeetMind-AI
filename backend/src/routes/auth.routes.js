const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/async-handler");

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.getMe));

module.exports = router;