const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const publicUserFields = { id: true, name: true, email: true, createdAt: true };

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: publicUserFields,
      orderBy: { id: 'asc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: publicUserFields,
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/:id (self only)
router.patch('/:id', async (req, res, next) => {
  try {
    const targetId = Number(req.params.id);
    if (targetId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const user = await prisma.user.update({
      where: { id: targetId },
      data: { name },
      select: publicUserFields,
    });
    res.json(user);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(err);
  }
});

// DELETE /api/users/:id (self only)
router.delete('/:id', async (req, res, next) => {
  try {
    const targetId = Number(req.params.id);
    if (targetId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own account' });
    }
    await prisma.user.delete({ where: { id: targetId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(err);
  }
});

module.exports = router;
