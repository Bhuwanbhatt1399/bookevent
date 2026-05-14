import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from '../utils/email.js'
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}


// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };


        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User record (isVerified: false)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        // 4. Generate & Save OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ email, action: 'account_verification' });
        await OTP.create({
            email,
            otp: otpCode,
            action: 'account_verification'
        });

        console.log(`✅ OTP generated for ${email}: ${otpCode}`);

        // 5. Send Email (Wait for it)
        sendOtpEmail(email, otpCode, 'account_verification')
            .then(() => {
                console.log("📧 OTP email sent successfully");
            })
            .catch((emailError) => {
                console.error("❌ Email sending failed:", emailError.message);
            });

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for OTP.",
            email: user.email
        });
    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};



// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials. Please Sign Up first.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if verified
        if (!user.isVerified && user.role === 'user') {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

            await OTP.deleteMany({ email, action: 'account_verification' });
            await OTP.create({
                email,
                otp: otpCode,
                action: 'account_verification'
            });

            sendOtpEmail(email, otpCode, 'account_verification')
                .then(() => {
                    console.log("📧 OTP resend successful");
                })
                .catch((error) => {
                    console.error("❌ OTP resend failed:", error.message);
                });

            return res.status(401).json({
                message: "Account not verified. A new OTP has been sent to your email.",
                needsVerification: true,
                email: user.email
            });
        }

        // Success Login
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//Verify OTP 

export const verifyUser = async (req, res) => {
    try {


        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp: otp, action: 'account_verification' });

        if (!otpRecord) {
            return res.status(401).json({ message: 'Invalid or expired OTP' })
        }
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true })

        //Remove used OTP
        await OTP.deleteMany({
            email,
            action: 'account_verification'
        });

        res.json({
            success: true,
            message: 'Account verified successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

};