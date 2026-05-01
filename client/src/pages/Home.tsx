import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  //   FaRegClock,
  //   FaTicketAlt,
  //   FaShieldAlt,
} from "react-icons/fa";

//  Event type define
interface EventType {
  _id: string;
  title: string;
  category: string;
  image?: string;
  date: string;
  location: string;
  ticketPrice: number;
  availableSeats: number;
  totalSeats: number;
}

const Home: React.FC = () => {

  //  Typed state
  const [events, setEvents] = useState<EventType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    setLoading(true);

    const timeoutId = setTimeout(() => {

      fetchEvents();

    }, 400);

    return () => clearTimeout(timeoutId);

  }, [search]);

  //  Typed function
  const fetchEvents = async (): Promise<void> => {
    try {

      const { data } = await api.get<EventType[]>(
        `/events?search=${search}`
      );

      setEvents(data);

    } catch (error) {

      console.error("Error fetching events:", error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">

        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Find Your Next Experience
          </h1>

          <div className="w-full max-w-2xl mx-auto relative flex items-center">

            <FaSearch className="absolute left-6 text-gray-500 text-xl" />

            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full pl-16 pr-6 py-5 rounded-full text-black bg-white"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />

          </div>
        </div>
      </div>



      {/* FEATURES SECTION */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

        {/* Fast Booking */}
        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="w-14 h-14 mx-auto bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4">
            ⏱
          </div>

          <h3 className="font-bold text-lg mb-2">
            Fast Booking
          </h3>

          <p className="text-gray-500 text-sm">
            Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.
          </p>

        </div>

        {/* Seamless Access */}
        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="w-14 h-14 mx-auto bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4">
            🎟
          </div>

          <h3 className="font-bold text-lg mb-2">
            Seamless Access
          </h3>

          <p className="text-gray-500 text-sm">
            Download tickets instantly or manage them right from your personal dashboard.
          </p>

        </div>

        {/* Secure Platform */}
        <div className="bg-white p-8 rounded-xl shadow text-center">

          <div className="w-14 h-14 mx-auto bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4">
            🛡
          </div>

          <h3 className="font-bold text-lg mb-2">
            Secure Platform
          </h3>

          <p className="text-gray-500 text-sm">
            All transactions and registrations are secured with advanced encryption and OTP.
          </p>

        </div>

      </div>

      {/* Events Section */}

      {loading ? (

        <div className="text-center py-20">
          Loading events...
        </div>

      ) : events.length === 0 ? (

        <div className="text-center py-20">
          No events found
        </div>

      ) : (



        <>

          {/* UPCOMING EVENTS HEADER */}

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold">
              Upcoming Events
            </h2>

            <span className="text-gray-500 text-sm">
              {events.length} results found
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {events.map((event) => (

              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >

                {/* IMAGE + PRICE */}
                <div className="relative h-48 bg-gray-200">

                  {event.image ? (

                    <img
                      src={`http://localhost:5000${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />



                  ) : (

                    <div className="flex items-center justify-center h-full text-gray-500">

                      No Image

                    </div>

                  )}

                  {/* PRICE BADGE */}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow font-bold">

                    {event.ticketPrice === 0
                      ? "Free"
                      : `₹${event.ticketPrice}`}

                  </div>

                </div>

                {/* CARD BODY */}
                <div className="p-6">

                  {/* CATEGORY */}
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">

                    {event.category}

                  </p>

                  {/* TITLE */}
                  <h2 className="text-xl font-bold mb-2">

                    {event.title}

                  </h2>

                  {/* DATE */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">

                    <FaCalendarAlt />

                    <span>

                      {new Date(event.date).toLocaleDateString()}

                    </span>

                  </div>

                  {/* LOCATION */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">

                    <FaMapMarkerAlt />

                    <span>

                      {event.location}

                    </span>

                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-200 h-2 rounded-full">

                    <div
                      className="bg-black h-2 rounded-full"
                      style={{
                        width: `${(event.availableSeats /
                          event.totalSeats) * 100
                          }%`
                      }}
                    />

                  </div>

                  {/* REMAINING TEXT */}
                  <p className="text-xs text-gray-500 mt-2">

                    {event.availableSeats} of {event.totalSeats} seats remaining

                  </p>

                  {/* BUTTON */}
                  <Link
                    to={`/events/${event._id}`}
                    className="block mt-4 text-center bg-gray-100 py-2 rounded font-medium"
                  >

                    View Details

                  </Link>

                </div>

              </div>

            ))}

          </div>
        </>
      )}

    </div>
  );
};

export default Home;
