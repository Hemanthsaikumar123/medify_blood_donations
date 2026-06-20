const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {becomeDonor,getMyDonorProfile} = require("../controllers/donorController");

router.post("/register",authMiddleware,becomeDonor);

router.get("/me",authMiddleware,getMyDonorProfile);

module.exports = router;