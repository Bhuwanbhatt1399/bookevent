import Booking from '../models/BookingModel.js';

import { sendBookingEmail } from '../utils/email.js';
import Event from '../models/eventModel.js';
import razorpay from '../utils/razorpay.js';

const generateOtp = () => {


    return Math.floor(100000 + Math.random() * 900000).toString();
};



export const bookEvent = async (req, res) => {

    try {
        const { eventId, quantity = 1 } = req.body;
        const ticketIds = [];

        for (let i = 0; i < (quantity || 1); i++) {

            ticketIds.push(
                "TKT-" + Math.floor(100000 + Math.random() * 900000)
            );

        }
        const bookingId = "BK-" + Math.floor(100000 + Math.random() * 900000);



        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });

        }

        if (event.availableSeats < (quantity || 1)) {
            return res.status(400).json({
                error: 'Not enough seats available'
            });
        }


        const booking = await Booking.create({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            eventId,
            bookingId: bookingId,
            quantity: quantity || 1,
            ticketIds: ticketIds,
            status: 'confirmed',
            paymentStatus: 'paid',
            amount: event.ticketPrice * (quantity || 1)
        });


        event.availableSeats -= (quantity || 1);
        await event.save();

        /* ✅ SEND BOOKING EMAIL */

        await sendBookingEmail(

            booking.userName,
            booking.userEmail,
            event.title,
            booking.bookingId,
            booking.quantity,
            booking.ticketIds,
            event.date,
            event.location

        );

        res.status(201).json({
            message: 'Booking created successfully'
        });
    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }


}

// payment 
export const createPaymentOrder = async (req, res) => {

    try {

        const { eventId, quantity = 1 } = req.body;

        const event = await Event.findById(eventId);

        if (!event) {

            return res.status(404).json({
                error: "Event not found"
            });

        }

        if (event.availableSeats < quantity) {

            return res.status(400).json({ error: "Not enough seats available" });

        }

        const amount =
            event.ticketPrice * quantity * 100; // paisa 

        const options = {

            amount: amount,
            currency: "INR",
            receipt:
                "receipt_" + Date.now(),

        };

        const order =
            await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: amount,
            eventTitle: event.title
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


export const confirmBooking = async (req, res) => {
    try {

        const paymentStatus = req.body.paymentStatus;
        if (paymentStatus && !['paid', 'non_paid'].includes(paymentStatus)) {
            return res.status(400).json({
                error: 'Invalid Payment status'
            });
        }
        const booking = await Booking.findById(req.params.id).populate("userId", "name email").populate("eventId");

        if (!booking) {
            return res.status(404).json({
                error: 'Booking not found'
            });
        }
        if (booking.status === 'confirmed') {
            return res.status(400).json({
                error: 'Booking is already confirmed'
            });
        }

        const event = booking.eventId;
        // const event = await Event.findById(booking.eventId);
        if (!event || event.availableSeats <= 0) {

            return res.status(400).json({ error: 'No seats available ' });
        }
        event.availableSeats -= booking.quantity;
        booking.status = 'confirmed';
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();

        await event.save();

        await sendBookingEmail(
            booking.userName,
            booking.userEmail,
            event.title,
            booking.bookingId,
            booking.quantity,
            booking.ticketIds,
            event.date,
            event.location

        );

        res.json({ message: 'Booking confirmed' });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};




export const getAllBookings = async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate('eventId')
            .populate('userId');

        res.json(bookings);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};


export const getMyBookings = async (req, res) => {
    // const booking = await Booking.find({ userId: req.user._id }).populate('eventId');
    const bookings = await Booking.find({
        userId: req.user._id
    }).populate('eventId');

    res.json(bookings);
};

export const cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });

    };


    if (booking.status === 'confirmed') {
        const event = await Event.findById(
            booking.eventId);

        if (event) {
            event.availableSeats += booking.quantity;
            await event.save();
        }
    }
    // booking.status = 'cancelled';

    await Booking.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Booking cancelled'
    });
};
//hello hwo are you  sp 