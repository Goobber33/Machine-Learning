import jwt, { JwtPayload } from 'jsonwebtoken';
import express from 'express';

const verifyToken: express.RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization');
  let token = '';
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('Missing env var JWT_SECRET');
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  if (!token || !decodedToken.username) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  next();
}

export default verifyToken;
