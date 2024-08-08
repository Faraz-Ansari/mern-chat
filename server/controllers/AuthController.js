import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userID) => {
    return jwt.sign({ email, userID }, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge,
    });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const user = new User({ email, password });
        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        const result = await user.save();

        return res.status(201).json({
            user: {
                id: result._id,
                email: result.email,
                profile: result.profileSetup,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("User not found");
        }

        const auth = await bcryptjs.compare(password, user.password);

        if (!auth) {
            return res.status(400).send("Password is incorrect");
        }

        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
