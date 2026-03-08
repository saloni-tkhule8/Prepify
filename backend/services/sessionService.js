const InterviewSession = require('../models/InterviewSession');

const createSession = async ({ userId, email, config, questions, results }) => {
  const avgScore =
    results.reduce((a, r) => a + (r.evaluation?.score || 0), 0) / results.length;

  return InterviewSession.create({
    user: userId,
    email,
    config,
    questions,
    results,
    avgScore: Math.round(avgScore * 10) / 10,
  });
};

const fetchSessionsByUser = async (userId) => {
  return InterviewSession
    .find({ user: userId })
    .select('email config results avgScore createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = { createSession, fetchSessionsByUser };
