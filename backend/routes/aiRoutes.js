const express = require("express");
const router = express.Router();
const aiController  = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/generate-questions", protect, aiController.generateQuestions);
router.post("/evaluate-answer", protect, aiController.evaluateAnswer);
router.post("/generate-roadmap", protect, aiController.generateRoadmap);
router.post("/analyze-resume", protect, aiController.analyzeResume);


module.exports = router;
