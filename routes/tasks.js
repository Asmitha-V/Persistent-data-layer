const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const VALID_STATUSES = ['todo', 'in_progress', 'done'];

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, dueDate, projectId, assigneeId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'title and projectId are required' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the project owner can manage tasks in this project' });
    }

    if (assigneeId) {
      const assignee = await prisma.user.findUnique({ where: { id: Number(assigneeId) } });
      if (!assignee) return res.status(400).json({ error: 'assigneeId does not reference an existing user' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'todo',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: Number(projectId),
        assigneeId: assigneeId ? Number(assigneeId) : null,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks?projectId=&assigneeId=&status=
router.get('/', async (req, res, next) => {
  try {
    const { projectId, assigneeId, status } = req.query;

    const where = {
      project: { ownerId: req.user.id },
    };
    if (projectId) where.projectId = Number(projectId);
    if (assigneeId) where.assigneeId = Number(assigneeId);
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({ where, orderBy: { id: 'asc' } });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id (owner: any field; assignee: status only)
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const project = await prisma.project.findUnique({ where: { id: task.projectId } });
    const isOwner = project.ownerId === req.user.id;
    const isAssignee = task.assigneeId === req.user.id;

    if (!isOwner && !isAssignee) {
      return res.status(403).json({ error: 'Only the project owner or the assignee can update this task' });
    }

    const incomingKeys = Object.keys(req.body);
    if (!isOwner && incomingKeys.some((k) => k !== 'status')) {
      return res.status(403).json({ error: 'Assignees may only update the task status' });
    }

    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: req.body.title ?? task.title,
        description: req.body.description ?? task.description,
        status: req.body.status ?? task.status,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : task.dueDate,
        assigneeId: req.body.assigneeId ?? task.assigneeId,
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id (project owner only)
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const project = await prisma.project.findUnique({ where: { id: task.projectId } });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the project owner can delete this task' });
    }

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
