const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  score:        { type: Number, required: true },
  feedback:     { type: String, required: true },
  strengths:    [{ type: String }],
  improvements: [{ type: String }],
}, { _id: false });

const ResultSchema = new mongoose.Schema({
  question:   { type: String, required: true },
  answer:     { type: String, required: true },
  evaluation: { type: EvaluationSchema, required: true },
}, { _id: false });

const InterviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  email: { type: String, default: '', index: true },
  config: {
    role:     { type: String, required: true },
    level:    { type: String, required: true },
    topics:   [{ type: String }],
    count:    { type: Number },
  },
  questions: [{ type: String }],
  results:   [ResultSchema],
  avgScore: {
    type: Number,
    default: function () {
      if (!this.results?.length) return 0;
      return this.results.reduce((a, r) => a + r.evaluation.score, 0) / this.results.length;
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
