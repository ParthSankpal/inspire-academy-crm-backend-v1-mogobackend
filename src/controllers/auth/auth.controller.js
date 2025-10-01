import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

// Super Admin creates new user
export const createUser = async (req, res, next) => {
    try {
        if (req.user.role !== "super_admin") {
            return res.status(403).json({ message: "Only Super Admin can create users" });
        }

        const { name, email, phone, role, passwordHashed, scope } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({
            name,
            email,
            phone,
            role,
            passwordHashed, // plain text, will be hashed by pre-save hook
            scope,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        next(error);
    }
};

// Login user
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            // optional: set cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    scope: user.scope,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                token,
            });

        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        next(error);
    }
};


// GET /api/users/me
// requires authMiddleware
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: req.token, // token from authMiddleware (if you attach it)
        });
    } catch (error) {
        next(error);
    }
};



export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};