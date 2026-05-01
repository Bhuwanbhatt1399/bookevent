import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

});

export const sendBookingEmail = async (
    userName,
    userEmail,
    eventTitle,
    bookingId,
    quantity,
    ticketIds,
    eventDate,
    eventLocation
) => {
    try {

        const mailOption = {
            from: `"UtsavBook" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed - ${eventTitle}`,

            html: `
               <h2>Hi ${userName}</h2>

                <p>Your booking has been successfully confirmed.</p>

                <h3>Event Details:</h3>

                <p>
                    <strong>Event:</strong> ${eventTitle}
                </p>

                <p>
                <strong>Date:</strong> ${eventDate}
                </p>

                <p>
                    <strong>Venue:</strong> ${eventLocation}
                </p>

                <hr>

                <h3>Booking Details:</h3>

                <p>
                    <strong>Booking ID:</strong> ${bookingId}
                </p>

                <p>
                    <strong>Number of Tickets:</strong> ${quantity}
                </p>

                <h4>Ticket IDs:</h4>

                <ul>
                    ${ticketIds.map(id => `<li>${id}</li>`).join("")}
                </ul>

                <br>

                <p>Thank you for choosing Accelevents.</p>

                <p>
                    Regards,<br>
                    <strong>Accelevents Team</strong>
                </p>
            `
        };
        console.log("📩 Sending email to:", userEmail);
        await transporter.sendMail(mailOption);

        console.log('Email send successfully to', userEmail);

    } catch (error) {

        console.error("❌ Email failed:", error.message);
        // throw error;

    }
};

export const sendOtpEmail = async (
    userEmail,
    otp,
    type
) => {
    try {
        const title = type === 'account_verification' ? 'verify your UtsavBook Account' : 'event booking verification'
        const msg = type == 'account_verification'
            ? 'Please use the following OTP to verify your new UtsavBook Account'
            : 'Please use the following OTP to verify and confirm your event booking';

        const mailOption = {
            from: `UtsavBook <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: title,
            html: `<h2>${title}</h2>

                <p>${msg}</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 5 minutes.</p>`

        };
        await transporter.sendMail(mailOption);
        console.log(`otp send to ${userEmail} for ${type}`);
    }
    catch (error) {
        console.error(`Error sending OTP email to ${userEmail} for ${type}`, error);
        throw error
    }
}