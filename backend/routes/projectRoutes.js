const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const loadProjectForMember = async (projectId, userId) => {
    const project = await Project.findById(projectId);
    if (!project) return { error: { status: 404, message: 'Not found' } };

    if (project.deleted) {
        return { error: { status: 404, message: 'Not found' } };
    }

    const isMember = project.members.some(memberId => memberId.toString() === userId);
    if (!isMember) {
        return { error: { status: 403, message: 'Forbidden: project members only' } };
    }

    return { project };
};

// Create project
router.post('/', auth, async (req, res) => {
    try {
        const { name, title, description } = req.body;
        const projectTitle = title || name;
        if (!projectTitle) return res.status(400).json({ message: 'Project title required' });

        const project = new Project({
            title: projectTitle,
            description,
            createdBy: req.user.id,
            members: [req.user.id],
            deleted: false
        });

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// List projects
router.get('/', auth, async (req, res) => {
    try {
        const includeDeleted = req.query.includeDeleted === 'true';
        const query = includeDeleted
            ? { deleted: true, createdBy: req.user.id }
            : { deleted: { $ne: true } };

        const projects = await Project.find(query)
            .populate('createdBy', 'name email')
            .populate('members', 'name email')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, deleted: { $ne: true } })
            .populate('createdBy', 'name email')
            .populate('members', 'name email');
        if (!project) return res.status(404).json({ message: 'Not found' });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a member to a project
router.post('/:id/members', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Member email required' });

        const user = await require('../models/User').findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { members: user._id } },
            { new: true }
        ).populate('createdBy', 'name email').populate('members', 'name email');

        if (!project) return res.status(404).json({ message: 'Not found' });

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Soft delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project || project.deleted) return res.status(404).json({ message: 'Not found' });

        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the project creator can delete this project' });
        }

        project.deleted = true;
        await project.save();

        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Restore project
router.patch('/:id/restore', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project || !project.deleted) return res.status(404).json({ message: 'Not found' });

        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the project creator can restore this project' });
        }

        project.deleted = false;
        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('createdBy', 'name email')
            .populate('members', 'name email');

        res.json(populatedProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get tasks for a project
router.get('/:id/tasks', auth, async (req, res) => {
    try {
        const membership = await loadProjectForMember(req.params.id, req.user.id);
        if (membership.error) return res.status(membership.error.status).json({ message: membership.error.message });

        const tasks = await Task.find({ project: req.params.id })
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/:id/tasks', auth, async (req, res) => {
    try {
        const membership = await loadProjectForMember(req.params.id, req.user.id);
        if (membership.error) return res.status(membership.error.status).json({ message: membership.error.message });

        const { title, status, assignedTo } = req.body;
        if (!title) return res.status(400).json({ message: 'Task title required' });

        let assignedUserId = null;
        if (assignedTo) {
            const project = membership.project;

            const isProjectMember = project.members.some(memberId => memberId.toString() === assignedTo);
            if (!isProjectMember) {
                return res.status(400).json({ message: 'Assigned user must be a project member' });
            }

            const user = await User.findById(assignedTo);
            if (!user) return res.status(404).json({ message: 'User not found' });
            assignedUserId = user._id;
        }

        const task = new Task({
            title,
            project: req.params.id,
            createdBy: req.user.id,
            assignedTo: assignedUserId,
            status: status || 'todo'
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit task
router.patch('/:id/tasks/:taskId', auth, async (req, res) => {
    try {
        const membership = await loadProjectForMember(req.params.id, req.user.id);
        if (membership.error) return res.status(membership.error.status).json({ message: membership.error.message });

        const { title, status, assignedTo } = req.body;
        const update = {};

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({ message: 'Task title required' });
            }
            update.title = title.trim();
        }

        if (status !== undefined) {
            const allowedStatuses = ['todo', 'in progress', 'done'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid task status' });
            }
            update.status = status;
        }

        if (assignedTo !== undefined) {
            if (assignedTo) {
                const project = membership.project;
                const isProjectMember = project.members.some(memberId => memberId.toString() === assignedTo);
                if (!isProjectMember) {
                    return res.status(400).json({ message: 'Assigned user must be a project member' });
                }

                const user = await User.findById(assignedTo);
                if (!user) return res.status(404).json({ message: 'User not found' });
                update.assignedTo = user._id;
            } else {
                update.assignedTo = null;
            }
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, project: req.params.id },
            update,
            { new: true }
        )
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email');

        if (!task) return res.status(404).json({ message: 'Not found' });

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task assignment
router.patch('/:id/tasks/:taskId/assignee', auth, async (req, res) => {
    try {
        const membership = await loadProjectForMember(req.params.id, req.user.id);
        if (membership.error) return res.status(membership.error.status).json({ message: membership.error.message });

        const { assignedTo } = req.body;

        if (assignedTo) {
            const project = membership.project;

            const isProjectMember = project.members.some(memberId => memberId.toString() === assignedTo);
            if (!isProjectMember) {
                return res.status(400).json({ message: 'Assigned user must be a project member' });
            }
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, project: req.params.id },
            { assignedTo: assignedTo || null },
            { new: true }
        )
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email');

        if (!task) return res.status(404).json({ message: 'Not found' });

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task status
router.patch('/:id/tasks/:taskId/status', auth, async (req, res) => {
    try {
        const membership = await loadProjectForMember(req.params.id, req.user.id);
        if (membership.error) return res.status(membership.error.status).json({ message: membership.error.message });

        const { status } = req.body;
        const allowedStatuses = ['todo', 'in progress', 'done'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid task status' });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, project: req.params.id },
            { status },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: 'Not found' });

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id/tasks/:taskId', auth, async (req, res) => {
    try {
        const membership = await loadProjectForMember(req.params.id, req.user.id);
        if (membership.error) return res.status(membership.error.status).json({ message: membership.error.message });

        await Task.findByIdAndDelete(req.params.taskId);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;