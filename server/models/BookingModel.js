import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true

    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['non_paid', 'paid'],
        default: 'non_paid'
    },
    amount: {
        type: Number,
        required: true
    },
    userName: {
        type: String
    },

    userEmail: {
        type: String
    },
    bookingId: {
        type: String,
        unique: true,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    ticketIds: [
        {
            type: String
        }
    ],

}, { timestamps: true });



const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;