import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications['api-key'];

apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi =
    new SibApiV3Sdk.TransactionalEmailsApi();



// BOOKING EMAIL

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

        const response =
            await tranEmailApi.sendTransacEmail({

                sender: {
                    email: process.env.SENDER_EMAIL,
                    name: "EventHive"
                },

                to: [
                    {
                        email: userEmail
                    }
                ],

                subject: `Booking Confirmed - ${eventTitle}`,

                htmlContent: `

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

                <p>Thank you for choosing EventHive.</p>

                <p>
                    Regards,<br>
                    <strong>EventHive Team</strong>
                </p>
                `
            });

        console.log("✅ Booking email sent:", response);

        return response;

    } catch (error) {

        console.error(
            "❌ Booking Email Error:",
            error.response?.body || error.message
        );

        throw error;
    }
};




// OTP EMAIL

export const sendOtpEmail = async (
    userEmail,
    otp,
    type
) => {

    try {

        const title =
            type === 'account_verification'
                ? 'Verify your EventHive Account'
                : 'Event Booking Verification';

        const msg =
            type === 'account_verification'
                ? 'Please use the following OTP to verify your account.'
                : 'Please use the following OTP to confirm your booking.';

        const response =
            await tranEmailApi.sendTransacEmail({

                sender: {
                    email: process.env.SENDER_EMAIL,
                    name: "EventHive"
                },

                to: [
                    {
                        email: userEmail
                    }
                ],

                subject: title,

                htmlContent: `

                <div style="font-family: Arial, sans-serif; padding: 20px;">

                    <h2 style="color: #4CAF50;">
                        ${title}
                    </h2>

                    <p>
                        ${msg}
                    </p>

                    <h1 style="
                        background: #f4f4f4;
                        padding: 10px;
                        display: inline-block;
                        letter-spacing: 5px;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP is valid for 5 minutes.
                    </p>

                </div>
                `
            });

        console.log("✅ OTP Email Sent:", response);

        return response;

    } catch (error) {

        console.error(
            "❌ BREVO API ERROR:",
            error.response?.body || error.message
        );

        throw error;
    }
};