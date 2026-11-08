const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/meetings", require("./meeting.routes"));

module.exports = router;