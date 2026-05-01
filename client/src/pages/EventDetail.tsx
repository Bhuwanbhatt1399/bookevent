import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

// import {
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaChair,
//   FaMoneyBillWave
// } from 'react-icons/fa';

/* ✅ Event Type */
interface EventType {
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  date: string;
  location: string;
  ticketPrice: number;
  availableSeats: number;
  totalSeats: number;
}

const EventDetail: React.FC = () => {

  /* ✅ Params Type */
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  /* ✅ Context Safe */
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext not found");
  }

  const { user } = auth;

  /* ✅ States */
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>('');
  // const [successMsg, setSuccessMsg] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);



  /* ✅ Fetch Event */
  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const { data } = await api.get<EventType>(`/events/${id}`);

        setEvent(data);

      } catch (err) {
        console.error(err);

        setError('Failed to load event details.');

      } finally {

        setLoading(false);
      }

    };

    if (id) {
      fetchEvent();
    }

  }, [id]);


  /* ✅ Quantity Controls */

  const increaseQty = () => {

    if (event &&
      quantity < event.availableSeats) {

      setQuantity(quantity + 1);

    }

  };

  const decreaseQty = () => {

    if (quantity > 1) {

      setQuantity(quantity - 1);

    }

  };


  /* ✅ Booking Handler */
  const goToSummary = () => {

  if (!user) {
    navigate('/login');
    return;
  }

  if (!event) return;

  navigate("/booking-summary", {
    state: {
      event,
      quantity
    }
  });

};



  /* ✅ Loading */
  if (loading) {

    return (
      <div className="text-center py-20 text-xl font-semibold"> Loading... </div>);
  }

  /* ✅ Event Not Found */
  if (!event) {

    return (
      <div className="text-center py-20 text-xl text-red-500">Event not found</div>
    );

  }
  // console.log("IMAGE PATH:", event.image);

  /* ✅ Sold Out Check */
  const isSoldOut =
    event?.availableSeats
      ? event.availableSeats <= 0
      : false;

  return (

    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">

      {event.image ? (

        <img
          src={`http://localhost:5000${event.image}`}
          alt={event.title}
          className="w-full h-80 object-cover"
        />
      ) : (

        <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">

          {event.category}

        </div>

      )}

      <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">

        {/* LEFT SIDE */}
        <div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4"> {event.title} </h1>

          <p className="text-gray-600 text-lg mb-6"> {event.description}</p>

        </div>

        {/* RIGHT SIDE BOOKING DETAILS */}
        <div className="bg-gray-50 p-6 rounded-xl border">

          <h2 className="text-xl font-bold mb-4"> Booking Details  </h2>

          <div className="space-y-3">

            {/* PRICE */}
            <p className="flex justify-between">
              <span className="text-gray-500"> Ticket Price </span>

              <span className="font-bold">₹{event.ticketPrice * quantity}</span>
            </p>

            {/* SEATS */}
            <p className="flex justify-between">
              <span className="text-gray-500"> Availability </span>

              <span className="font-bold">
                {event.availableSeats} / {event.totalSeats}
              </span>
            </p>

            {/* QUANTITY */}

            <p className="flex justify-between items-center">

              <span className="text-gray-500">
                Seats
              </span>

              <span className="flex items-center gap-3">

                <button
                  onClick={decreaseQty}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  −
                </button>

                <span className="font-bold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQty}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  +
                </button>

              </span>

            </p>


            {/* DATE */}
            <p className="flex justify-between">
              <span className="text-gray-500"> Date </span>

              <span className="font-bold">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </p>

            {/* LOCATION */}
            <p className="flex justify-between">
              <span className="text-gray-500"> Location</span>

              <span className="font-bold">{event.location} </span>
            </p>

          </div>

          {/* OTP Input */}

          <button

  onClick={goToSummary}

  disabled={isSoldOut}

  className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gray-900 text-white"

>

  {isSoldOut
    ? 'Sold Out'
    : 'Book Now'}

</button>

          {error && (

            <p className="text-red-500 mt-4 text-center">

              {error}

            </p>

          )}

    

        </div>

      </div>

    </div>


  );

};

export default EventDetail;