const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, trim: true, default: '' },
  acceptanceCriteria: [{ type: String, trim: true }],
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  storyPoints: { type: Number, enum: [0, 1, 2, 3, 5, 8, 13], default: 0 },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Code Review', 'Done'],
    default: 'To Do'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
