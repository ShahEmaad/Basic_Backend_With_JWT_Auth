const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        user.name = req.body.name || user.name;
        user.age = req.body.age || user.age;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// This route is not Secure and dosent hash password
exports.updateUserDetails = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        Object.assign(user, req.body);
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.user.email });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
