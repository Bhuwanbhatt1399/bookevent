import nodemailer from 'nodemailer'
import dotenv from "dotenv";
import dns from "dns";
import { Resend } from 'resend';
dns.setDefaultResultOrder("ipv4first");
dotenv.config();

// const transporter = nodemailer.createTransport({

//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,

//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },

//     tls: {
//         rejectUnauthorized: false
//     },
//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000

// });




// Initialize Resend with your API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmail = async (
    userName, userEmail, eventTitle, bookingId, quantity, ticketIds, eventDate, eventLocation
) => {
    try {
        await resend.emails.send({
            from: 'UtsavBook <onboarding@resend.dev>',
            to: userEmail,
            subject: `Booking Confirmed - ${eventTitle}`,
            html: `
                <h2>Hi ${userName}</h2>
                <p>Your booking has been successfully confirmed.</p>
                <h3>Event Details:</h3>
                <p><strong>Event:</strong> ${eventTitle}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Venue:</strong> ${eventLocation}</p>
                <hr>
                <h3>Booking Details:</h3>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Number of Tickets:</strong> ${quantity}</p>
                <h4>Ticket IDs:</h4>
                <ul>${ticketIds.map(id => `<li>${id}</li>`).join("")}</ul>
                <p>Thank you for choosing UtsavBook.</p>`
        });
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error("❌ Email failed:", error.message);
        throw error;
    }
};

export const sendOtpEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your UtsavBook Account' : 'Event Booking Verification';
        const msg = type === 'account_verification' 
            ? 'Please use the following OTP to verify your new UtsavBook Account'
            : 'Please use the following OTP to verify and confirm your event booking';

        await resend.emails.send({
            from: 'UtsavBook <onboarding@resend.dev>',
            to: userEmail,
            subject: title,
            html: `<h2>${title}</h2><p>${msg}</p><h1>${otp}</h1><p>This OTP is valid for 5 minutes.</p>`
        });
        console.log(`OTP sent to ${userEmail}`);
    } catch (error) {
        console.error(`Error sending OTP email`, error);
        throw error;
    }
};