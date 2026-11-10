const mongoose = require('mongoose');
const Project = require('../models/Project');
const Story = require('../models/Story');
const asyncHandler = require('../utils/asyncHandler');

const allowedStatuses = ['To Do', 'In Progress', 'Code Review', 'Done'];

async function ownedProject(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId)) return null;
  return Project.findOne({ _id: projectId, owner: userId });
}

exports.listByProject = asyncHandler(async (req, res) => {
  const project = await ownedProject(req.params.projectId, req.user._id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  const stories = await Story.find({ project: project._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { stories } });
});

exports.create = asyncHandler(async (req, res) => {
  const project = await ownedProject(req.params.projectId, req.user._id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  const { title, description = '', priority = 'Medium', storyPoints = 0, acceptanceCriteria = [] } = req.body;
  if (!title || !String(title).trim()) {
    res.status(400);
    throw new Error('Story title is required');
  }
  const story = await Story.create({
    project: project._id, title, description, priority, storyPoints,
    acceptanceCriteria: Array.isArray(acceptanceCriteria) ? acceptanceCriteria : [],
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, data: { story } });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid story status');
  }
  const story = await Story.findById(req.params.storyId).populate('project');
  if (!story || String(story.project.owner) !== String(req.user._id)) {
    res.status(404);
    throw new Error('Story not found');
  }
  story.status = status;
  await story.save();
  res.json({ success: true, data: { story } });
});
