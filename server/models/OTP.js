import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    Otp: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['account_verification', 'event_booking'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300

    }

});


export default mongoose.model('OTP', otpSchema)