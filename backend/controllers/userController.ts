import { Request, Response } from 'express';
import User from '../models/userModel';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const signup = async (req: Request, res: Response) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
    });

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Return some kind of success response, e.g. user data, authentication token, etc.
    res.status(200).json({ msg: 'User registered successfully.' });
  } catch (err: any) { // Here, define err as any
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const signin = async (req: Request, res: Response) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Return some kind of success response, e.g. user data, authentication token, etc.
    res.status(200).json({ msg: 'User logged in successfully.' });
  } catch (err: any) { // Here, define err as any
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
