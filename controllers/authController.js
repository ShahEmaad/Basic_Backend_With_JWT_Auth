const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Auth = require('../models/auth');
const User = require('../models/user');

exports.signUp = async (req, res) => {
    const alreadyExists = await User.findOne({ email: req.body.email });
    if (alreadyExists) {
        return res.status(401).json({ message: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const email = req.body.email;
            const userPayload = { email: email };
            const accessToken = generateAccessToken(userPayload);
            const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);
            const authToken = new Auth({ refreshToken: refreshToken });
            await authToken.save();
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.body.token;
        const auth = await Auth.findOne({ refreshToken: token });
        if (auth) {
            await Auth.findByIdAndDelete(auth._id);
            res.sendStatus(204);
        } else {
            res.status(400).json({ message: "Token not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.generateToken = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const auth = await Auth.findOne({ refreshToken: refreshToken });
        if (!auth) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ email: user.email });
            res.json({ accessToken: accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50m' });
}
