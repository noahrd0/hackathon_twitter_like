import { generateToken, decodeToken } from "../config/jwt.js";
import User from "../models/UserModel.js";

export const registerUser = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create(req.body);

        const token = generateToken(user._id);

        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        // Get the User ID from the token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = decodeToken(token);
        
        const user = await User.findByIdAndUpdate(decodedToken.id, req.body, { new: true });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    if (!req.params.username) {
        // Show connected user
        try {
            // Get the User ID from the token
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = decodeToken(token);
            const user = await User.findById(decodedToken.id);

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {

        // Show single user
        try {
            const user = await User.findOne({ username: req.params.username });
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export const deleteUser = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide user ID' });
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const followUser = async (req, res) => {
    if (!req.params.username || !req.body.userId) {
        return res.status(400).json({ message: 'Please provide username and request body userId' });
    }

    try {
        const user = await User.findOne({ username: req.params.username });
        const currentUser = await User.findById(req.body.userId);

        if (!user.followers.includes(req.body.userId)) {
            // Follow
            await user.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({ $push: { following: user._id } });
            return res.status(200).json({ message: 'User followed' });
        } else {
            // Unfollow
            await user.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({ $pull: { following: user._id } });
            return res.status(200).json({ message: 'User unfollowed' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}