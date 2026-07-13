const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'done'],
    default: 'open'
  },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const setResolvedAtIfDone = (update) => {
  const status = update.$set?.status ?? update.status;
  if (status === 'done') {
    const resolvedAt = new Date();
    if (update.$set) {
      update.$set.resolvedAt = resolvedAt;
    } else {
      update.resolvedAt = resolvedAt;
    }
  }
};

TaskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'done') {
    this.resolvedAt = new Date();
  }
  next();
});

TaskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update) setResolvedAtIfDone(update);
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
