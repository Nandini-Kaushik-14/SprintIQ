const asyncHandler = require('../utils/asyncHandler');

async function forward(path, body) {
  const base = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const response = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.detail || 'AI service request failed');
    error.status = response.status;
    throw error;
  }
  return payload;
}

exports.estimateStory = asyncHandler(async (req, res) => {
  const { rawRequirement } = req.body;
  if (!rawRequirement || !String(rawRequirement).trim()) {
    res.status(400);
    throw new Error('rawRequirement is required');
  }
  const result = await forward('/estimate-story', { rawRequirement });
  res.json({ success: true, data: result });
});

exports.sprintAdvisor = asyncHandler(async (req, res) => {
  const result = await forward('/sprint-advisor', req.body);
  res.json({ success: true, data: result });
});

exports.blockerAssistant = asyncHandler(async (req, res) => {
  const { errorMessage, taskContext = '' } = req.body;
  if (!errorMessage || !String(errorMessage).trim()) {
    res.status(400);
    throw new Error('errorMessage is required');
  }
  const result = await forward('/blocker-assistant', { errorMessage, taskContext });
  res.json({ success: true, data: result });
});
