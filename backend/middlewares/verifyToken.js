const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Allow the root path ("/") to be accessed without requiring a token
  if (req.path === '/') {
    return next();
  } 

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the user from the decoded token in the request object
    req.user = decoded.user;

    // Proceed to the next middleware
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token.' });
  }
};

module.exports = verifyToken;
