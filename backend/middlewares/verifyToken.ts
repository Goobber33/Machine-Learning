import jwt from 'jsonwebtoken';
import express from 'express';

const verifyToken: express.RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization');
  let token = '';
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  next();
}

export default verifyToken;
