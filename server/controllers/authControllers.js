import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from '../utils/email.js'
import jwt from "jsonwebtoken";



const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

//register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // generate OTP

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`otp for ${email}: ${otpCode}`)

        // save OTP in database
        await OTP.create({ email, Otp: otpCode, action: 'account_verification' })

        // send OTP email
        await sendOtpEmail(email, otpCode, 'account_verification')

        //  create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });


        res.status(201).json({
            message: "User registered successfully . Please check your email for OTP to verify your account ",
            email: user.email
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



//Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid credential Please Sign Up first ' })
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Invalid credential' })
        }
        if (!user.isVerified && user.role === 'user') {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({ email, action: 'account_verification' })// remove old otp    
            await OTP.create({ email, Otp: otpCode, action: 'account_verification' });
            await sendOtpEmail(email, otpCode, 'account_verification');

            return res.status(401).json({
                message: "Account not verified a new OTP has been sent to your email",
                 needsVerification: true
            })
        }

        res.json({
            message: 'Login successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

};


//Verify OTP 

export const verifyUser = async (req, res) => {
    try {
        

        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, Otp: otp, action: 'account_verification' });

        if (!otpRecord) {
            return res.status(401).json({ error: 'Invalid or expired OTP' })
        }
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true })

        //Remove used OTP
        await OTP.deleteMany({
            email,
            action: 'account_verification'
        });

        res.json({
            message: 'Account verified successfully.Now you can log in ',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)

        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

};