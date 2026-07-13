const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.get('/status', auth, async (req, res) => {
  try {
    const results = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/priority', auth, async (req, res) => {
  try {
    const results = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/assignee', auth, async (req, res) => {
  try {
    const results = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          count: 1
        }
      }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/resolution-time', auth, async (req, res) => {
  try {
    const results = await Task.aggregate([
      {
        $match: {
          status: 'done',
          resolvedAt: { $ne: null }
        }
      },
      {
        $project: {
          diffInDays: {
            $divide: [
              { $subtract: ['$resolvedAt', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$diffInDays' }
        }
      }
    ]);

    const avgResolutionTime = results.length > 0 ? results[0].avgResolutionTime : null;
    res.json({ avgResolutionTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
