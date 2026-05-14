
import nodemailer from 'nodemailer'
import dotenv from "dotenv";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Hosted environment par certificate block hone se rokta hai
    }

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
            from: `"EventHive" <${process.env.EMAIL_USER}>`,
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
        // await transporter.verify();

        // console.log("SMTP READY");

        const info = await transporter.sendMail(mailOption);

        console.log("MAIL RESPONSE:", info);

        console.log('Email send successfully to', userEmail);

    } catch (error) {

        console.error("❌ Email failed:", error.message);
        throw error;

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
            from: `EventHive <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: title,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4CAF50;">${title}</h2>
                    <p>${msg}</p>
                    <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                </div>
                `

        };



        //     await new Promise((resolve, reject) => {
        //         transporter.sendMail(mailOption, (err, info) => {
        //             if (err) {
        //                 console.error("SMTP error:", err);
        //                 reject(err);
        //             } else {
        //                 console.log("MAIL RESPONSE:", info);
        //                 console.log(`OTP sent to ${userEmail} for ${type}`);
        //                 resolve(info);
        //             }
        //         });
        //     });
        // } catch (error) {
        //     console.error(
        //         `Error sending OTP email to ${userEmail} for ${type}:`,
        //         error.message
        //     );
        //     throw error; // important: don’t swallow error; let register controller fail
        // }

        //Manual Promise hatayein, transporter.sendMail khud promise return karta hai agar callback na ho
        const info = await transporter.sendMail(mailOption);
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
        throw error; // Isse controller ko pata chalega ki mail fail hua hai
    }
};
