const User = require('../models/User');
const createToken = require('../utils/token');
const asyncHandler = require('../utils/asyncHandler');

const safeUser = (user) => ({
  id: user._id, name: user.name, email: user.email, role: user.role
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (String(password).length < 8) {
    res.status(400);
    throw new Error('Password must contain at least 8 characters');
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }
  // Public registration cannot assign privileged roles.
  const user = await User.create({ name, email: normalizedEmail, password, role: 'Developer' });
  res.status(201).json({ success: true, data: { user: safeUser(user), token: createToken(user._id) } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({ success: true, data: { user: safeUser(user), token: createToken(user._id) } });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: safeUser(req.user) } });
});
