import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// This is just an example. In a real application, you should store user data securely in a database.
const mockUser = {
  username: 'testUser',
  // Password is 'password' hashed using bcrypt.
  passwordHash: '$2b$10$q2vdhDZ.3D3EOqDpVtbaeulzNWiClw5yIZOj./SiZR/i96ZwQbaHG',
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username || !await bcrypt.compare(password, mockUser.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const userForToken = {
    username: mockUser.username,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET);

  res.json({ token, username: mockUser.username });
});

export default router;
