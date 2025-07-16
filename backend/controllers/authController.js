const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) return res.status(400).json({ msg: 'User already exists' });
    const round = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, round);
    const user = await User.create({name,email,password: hashedPassword
    });
    res.json({_id: user._id, name: user.name,token: generateToken(user._id)});
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  res.json({_id: user._id,name: user.name,token: generateToken(user._id)
  });
};
