import asyncHandler from 'express-async-handler';
import generateToken from '../config/generateToken.js';
import User from '../models/userModel.js';

// Create guest user if it doesn't exist
const createGuestUser = async () => {
    const guestEmail = "guest@example.com";
    let guestUser = await User.findOne({ email: guestEmail });
    
    if (!guestUser) {
        guestUser = await User.create({
            name: "Guest User",
            email: guestEmail,
            password: "123456",
            pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        });
    }
    return guestUser;
};

export const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ message: "Please Enter all the fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).send({ message: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), // ✅ Corrected line
        });
    } else {
        res.status(400).send({ message: "Failed to create the user" });
    }
};

export const authUser = async (req, res) => {
    const { email, password } = req.body;
    
    // If it's a guest login attempt, ensure guest user exists
    if (email === "guest@example.com") {
        const guestUser = await createGuestUser();
        if (await guestUser.matchPassword(password)) {
            return res.json({
                _id: guestUser._id,
                name: guestUser.name,
                email: guestUser.email,
                pic: guestUser.pic,
                token: generateToken(guestUser._id),
            });
        }
    }

    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).send({ message: "Invalid email or password" });
    }
};

export const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword);

    res.json(users);
};

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, pic } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Update fields if they are provided
        if (name) user.name = name;
        if (email) {
            // Check if email is already taken by another user
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                res.status(400);
                throw new Error("Email already in use");
            }
            user.email = email;
        }
        if (pic) user.pic = pic;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
