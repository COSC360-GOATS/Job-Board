import bcrypt from 'bcrypt';
import User from '../models/User.js';

export default {
  async register({ name, email, password }) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    return { id: newUser._id, name: newUser.name, email: newUser.email };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid email or password');

    return { id: user._id, name: user.name, email: user.email };
  }
};