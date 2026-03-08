const aiService = require("../services/aiService");

const generateQuestions = async (req, res) => {
    try {
        const data = await aiService.generateQuestions(req.body);
        res.json({ success : true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const evaluateAnswer = async (req, res) => {
    try {
        const data = await aiService.evaluateAnswer(req.body);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const generateRoadmap = async (req, res) => {
    try {
        const data = await aiService.generateRoadmap(req.body);
        res.json({ success: true, data });
    } catch (err) {
        console.error('generateQuestions error:', err.message, err.status);
        res.status(500).json({ success: false, message: err.message });
    }
};

const analyzeResume = async (req, res) => {
  try {
    const { base64File, targetRole } = req.body;
    if (!base64File) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }
    const data = await aiService.analyzeResume({ base64File, targetRole });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateQuestions, evaluateAnswer, evaluateAnswer, generateRoadmap, analyzeResume };
