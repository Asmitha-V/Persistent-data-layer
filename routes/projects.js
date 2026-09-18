const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// POST /api/projects
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const project = await prisma.project.create({
      data: { name, description: description || null, ownerId: req.user.id },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects (only ones the logged-in user owns)
router.get('/', async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.id },
      orderBy: { id: 'asc' },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: Number(req.params.id) } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/projects/:id (owner only)
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the project owner can edit this project' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: req.body.name ?? project.name,
        description: req.body.description ?? project.description,
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id (owner only) - cascades to tasks via schema
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the project owner can delete this project' });
    }

    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
