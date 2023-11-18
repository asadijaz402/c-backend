const User = require('../models/user');
const logger = require('../logger/logger');
// Validation function
function validateUser(user) {
  if (!user.name || !user.email || !user.password) {
    throw new Error('Name, email, and password are required');
  }
}

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .skip(Number(req.query.offset) || 0)
        .limit(Number(req.query.limit) || 10)
        .sort(req.query.sort || 'createdAt');
      res.json(users);
    } catch (error) {
      logger.error(`Error in getAllUsers: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      logger.error(`Error in getUserById: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createUser: async (req, res) => {
    try {
      validateUser(req.body);
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      logger.error(`Error in createUser: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      validateUser(req.body);
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      logger.error(`Error in updateUser: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      logger.error(`Error in deleteUser: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UserController;
