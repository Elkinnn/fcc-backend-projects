import express from 'express';
import bcrypt from 'bcryptjs';
import { findByUsername } from '../utils/db.js';
import { signToken } from '../utils/jwt.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  res.json({ token });
});

export default router;