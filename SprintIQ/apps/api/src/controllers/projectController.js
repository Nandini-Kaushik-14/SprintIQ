const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: { projects } });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, description = '' } = req.body;
  if (!name || !String(name).trim()) {
    res.status(400);
    throw new Error('Project name is required');
  }
  const project = await Project.create({ name, description, owner: req.user._id });
  res.status(201).json({ success: true, data: { project } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, data: { project } });
});
