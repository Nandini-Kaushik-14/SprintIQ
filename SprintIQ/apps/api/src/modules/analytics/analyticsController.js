const Project = require('../../models/Project');
const Story = require('../../models/Story');
const asyncHandler = require('../../utils/asyncHandler');

exports.summary = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  const stories = await Story.find({ project: project._id });
  const statusCounts = { 'To Do': 0, 'In Progress': 0, 'Code Review': 0, Done: 0 };
  let pointsCommitted = 0;
  let pointsCompleted = 0;
  for (const story of stories) {
    statusCounts[story.status] += 1;
    pointsCommitted += story.storyPoints;
    if (story.status === 'Done') pointsCompleted += story.storyPoints;
  }
  const totalStories = stories.length;
  const completedStories = statusCounts.Done;
  const completionRate = totalStories ? Math.round((completedStories / totalStories) * 100) : 0;
  res.json({
    success: true,
    data: { totalStories, completedStories, completionRate, pointsCommitted, pointsCompleted, statusCounts }
  });
});
