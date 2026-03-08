const model = require("../config/gemini");


const generateQuestions = async ({ role, level, topics = [], count = 5 }) => {
  const topicsLine = topics.length
    ? `Topics to cover: ${topics.join(', ')}.`
    : `Cover a broad range of relevant topics for a ${role} developer.`;

  const prompt = `Generate ${count} interview questions for a ${level} ${role} developer.
${topicsLine}
Return ONLY a valid JSON array of plain strings. No explanation, no markdown, no extra text.
Each element must be just the question text as a string.
["question 1", "question 2", ...]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

const evaluateAnswer = async ({ question, answer, role }) => {
  const prompt = `You are a ${role} interviewer. Evaluate this answer.
Question: ${question}
Answer: ${answer}
Return ONLY a valid JSON object. No explanation, no markdown, no extra text.
The object must have EXACTLY these keys: "score", "feedback", "strengths", "improvements"
{ "score": <number 1-10>, "feedback": "...", "strengths": ["..."], "improvements": ["..."] }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

const generateRoadmap = async ({ role, level, targetLevel, timeline }) => {
  const prompt = `Create a learning roadmap for a ${level} ${role} developer to reach ${targetLevel} level in ${timeline}.
Return ONLY a valid JSON object. No explanation, no markdown, no extra text.
The object must have EXACTLY these keys: "title", "phases"
Each phase must have EXACTLY these keys: "phase", "title", "duration", "topics", "resources"
{ "title": "...", "phases": [{ "phase": 1, "title": "...", "duration": "...", "topics": ["..."], "resources": ["..."] }] }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

const analyzeResume = async ({ base64File, targetRole }) => {
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64File,
      },
    },
    {
      text: `Analyze this resume for a ${targetRole} position.
Return ONLY a valid JSON object. No explanation, no markdown, no extra text.
The object must have EXACTLY these keys: "score", "strengths", "weaknesses", "missingSkills", "suggestions", "summary"
{ "score": <number 1-100>, "strengths": ["..."], "weaknesses": ["..."], "missingSkills": ["..."], "suggestions": ["..."], "summary": "..." }`,
    },
  ]);

  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

module.exports = { generateQuestions, evaluateAnswer, generateRoadmap, analyzeResume };
