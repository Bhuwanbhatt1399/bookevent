import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import api from '../utils/axios';

const BookingSummary = () => {

    const location = useLocation();
    const [paymentLoading, setPaymentLoading] = useState(false);
    // Data coming from previous page
    const { event, quantity } = location.state || {};

    // Safety check
    if (!event) {

        return (
            <div className="text-white text-center mt-20">
                No booking data found
            </div>
        );
    }

    /* ✅ Price Calculations */

    const pricePerTicket = event.ticketPrice;

    const subTotal = pricePerTicket * quantity;

    const gst = Math.round(subTotal * 0.18);

    const convenienceFee = 20;

    const totalAmount =
        subTotal + gst + convenienceFee;


    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }


            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);

        });

    };


    const handlePayment = async () => {

        try {

            setPaymentLoading(true);

            /* create order */

            const response =
                await api.post(
                    "/booking/create-order",
                    {
                        eventId: event._id,
                        quantity
                    }
                );

            const data = response.data;

            /* load Razorpay */

            const res =
                await loadRazorpayScript();

            if (!res) {
                alert("Razorpay failed to load");
                return;
            }

            const options = {

                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,

                amount: data.amount,

                currency: "INR",

                name: "Event Booking",

                description: event.title,

                order_id: data.orderId,

                handler: async function (response: any) {

                    await api.post(
                        "/booking",
                        {
                            eventId: event._id,
                            quantity,
                            razorpayPaymentId: response.razorpay_payment_id
                        }
                    );

                    alert("Payment successful!");

                }

            };

            const paymentObject =
                new (window as any)
                    .Razorpay(options);

            paymentObject.open();

        } catch (err: any) {

            alert(
                err.response?.data?.error
                || "Payment failed"
            );

        } finally {

            setPaymentLoading(false);

        }

    };

    return (
        <div className="min-h-screen flex justify-center pt-16 bg-gradient-to-br from-black via-gray-900 to-black">

            <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-xl p-6">

                {/* DATE */}

                <h2 className="text-lg font-bold mb-2">
                    DATE
                </h2>

                <p className="text-sm text-gray-300 mb-6">
                    {new Date(event.date).toLocaleDateString()}
                </p>


                {/* LOCATION */}

                <h2 className="text-lg font-bold mb-2">
                    LOCATION
                </h2>

                <p className="text-sm text-gray-300 mb-6">
                    {event.location}
                </p>


                {/* TICKET */}

                <h2 className="text-lg font-bold mb-2">
                    TICKET
                </h2>

                <div className="flex justify-between text-sm mb-4">

                    <span>
                        {quantity} X Ticket (₹{pricePerTicket})
                    </span>

                    <span>
                        ₹{subTotal}
                    </span>

                </div>


                {/* PRICE DETAILS */}

                <h2 className="text-lg font-bold mb-2">
                    PRICE DETAILS
                </h2>

                <div className="flex justify-between text-sm mb-1">
                    <span>Sub Total</span>
                    <span>₹{subTotal}</span>
                </div>

                <div className="flex justify-between text-sm mb-1">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                </div>

                <div className="flex justify-between text-sm mb-4">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                </div>

                <hr className="border-gray-700 mb-4" />


                {/* TOTAL */}

                <div className="flex justify-between items-center mb-6">

                    <span className="text-lg font-semibold">
                        Total
                    </span>

                    <div className="text-right">

                        <p className="text-xl font-bold">
                            ₹{totalAmount}
                        </p>

                        <p className="text-xs text-gray-400">
                            Inclusive of all taxes
                        </p>

                    </div>

                </div>


                {/* Proceed Button */}

                <button
                    onClick={handlePayment}

                    disabled={paymentLoading}

                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition"
                >

                    {paymentLoading
                        ? "Processing..."
                        : "Proceed To Pay"}

                </button>

            </div>

        </div>
    );
};

export default BookingSummary;