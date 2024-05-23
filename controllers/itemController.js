const Item = require('../models/item');
const User = require('../models/user');

exports.createItem = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        const item = new Item({
            heading: req.body.heading,
            content: req.body.content,
            user: user._id,
            comp: req.body.comp,
        });

        const savedItem = await item.save();
        res.status(200).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const items = await Item.find({ user: user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const item = await Item.findById(req.params.id);
        if (!item || item.user.toString() !== user._id.toString()) {
            return res.status(404).json({ message: "Item not found." });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const item = await Item.findById(req.params.id);
        if (!item || item.user.toString() !== user._id.toString()) {
            return res.status(404).json({ message: "Item not found." });
        }
        Object.assign(item, req.body);
        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const item = await Item.findById(req.params.id);
        if (!item || item.user.toString() !== user._id.toString()) {
            return res.status(404).json({ message: "Item not found." });
        }
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAllItems = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        await Item.deleteMany({ user: user._id });
        res.json({ message: "All items deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
