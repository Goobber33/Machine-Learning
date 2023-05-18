import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  username: string;
  password: string;
}

const router = express.Router();

// Create an empty array to store user data (for demonstration purposes)
let users: User[] = [];

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create a new user object
  const newUser: User = {
    username,
    password: hashedPassword,
  };

  // Store the new user
  users.push(newUser);

  // Generate a JWT token for the new user
  const token = jwt.sign({ username }, process.env.JWT_SECRET!);

  // Return the token and user data
  res.json({ token, user: newUser });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user with the provided username
  const user = users.find(user => user.username === username);

  // If the user doesn't exist or the password is incorrect, return an error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ username }, process.env.JWT_SECRET!);

  // Return the token and user data
  res.json({ token, user });
});

export default router;
