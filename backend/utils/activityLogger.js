const Activity = require('../models/Activity');
const User = require('../models/User');

const getUserName = async (userId) => {
  const user = await User.findById(userId).select('name email');
  return user?.name || user?.email || 'Someone';
};

const recordActivity = async ({ projectId, taskId, userId, type, message }) => {
  await Activity.create({
    project: projectId,
    task: taskId,
    user: userId,
    type,
    message
  });
};

module.exports = { getUserName, recordActivity };
