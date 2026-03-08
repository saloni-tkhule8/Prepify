const { createSession, fetchSessionsByUser } = require('../services/sessionService');

const saveSession = async (req, res) => {
  try {
    const { config, questions, results } = req.body;

    if (!config || !results?.length) {
      return res.status(400).json({ success: false, message: 'config and results are required.' });
    }

    const session = await createSession({
      userId: req.user.id,
      email:  req.user.email,
      config,
      questions,
      results,
    });

    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await fetchSessionsByUser(req.user.id);
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { saveSession, getSessions };