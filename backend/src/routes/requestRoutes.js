const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {createBloodRequest} = require("../controllers/requestController");

router.post("/",authMiddleware,createBloodRequest);

module.exports = router;