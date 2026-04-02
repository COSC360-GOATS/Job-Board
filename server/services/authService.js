import bcrypt from 'bcrypt';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const usersPath = join(__dirname, '../data/users.json');

const getUsers = () => JSON.parse(readFileSync(usersPath, 'utf-8'));
const saveUsers = (users) => writeFileSync(usersPath, JSON.stringify(users, null, 2));

export default {
  async register({ name, email, password }) {
    const users = getUsers();
    const exists = users.find(u => u.email === email);
    if (exists) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, name, email, password: hashed };
    users.push(newUser);
    saveUsers(users);

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  },

  async login({ email, password }) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid email or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid email or password');

    return { id: user.id, name: user.name, email: user.email };
  }
};