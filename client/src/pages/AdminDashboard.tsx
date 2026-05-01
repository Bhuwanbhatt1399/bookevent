import React, {
  useState,
  useEffect,
  useContext
} from 'react';

import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

/* ✅ Event Type */

interface EventType {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  totalSeats: number;
  availableSeats: number;
  ticketPrice: number;
  image?: string;
}

/* ✅ Booking Type */

interface BookingType {
  _id: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;

  userId?: {
    _id: string;
    name: string;
    email: string;
  };

  eventId?: {
    _id: string;
    title: string;
    availableSeats: number;
    totalSeats: number;
  };
}

/* Form Type */

interface EventFormType {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  totalSeats: string;
  ticketPrice: string;
  image: File | null;
  time: string;

}

const AdminDashboard: React.FC = () => {

  /* ✅ Context Safe */

  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext not found");
  }



  const { user } = auth;

  const navigate = useNavigate();

  /* ✅ State Types */

  const [events, setEvents] =
    useState<EventType[]>([]);

  const [bookings, setBookings] =
    useState<BookingType[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [showEventForm, setShowEventForm] =
    useState<boolean>(false);

  const [formData, setFormData] =
    useState<EventFormType>({
      title: '',
      description: '',
      date: '',
      location: '',
      category: '',
      totalSeats: '',
      ticketPrice: '',
      image: null,
      time: '',

    });

  /* ✅ Load Data */

  useEffect(() => {

    if (!user || user.role !== 'admin') {

      navigate('/login');
      return;

    }

    fetchData();

  }, [user, navigate]);

  /* ✅ Fetch Data */

  const fetchData = async (): Promise<void> => {

    try {

      const [eventsRes, bookingsRes] =
        await Promise.all([
          api.get<EventType[]>('/events'),
          // api.get<BookingType[]>('/booking/mybooking')
          api.get<BookingType[]>('/booking/all')
        ]);

      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);

    } catch (error) {

      console.error(
        'Error fetching admin data',
        error
      );

    } finally {

      setLoading(false);

    }

  };


  /* ✅ Create Event */

  const handleCreateEvent =
    async (
      e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {

      e.preventDefault();

      try {

        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("date", formData.date);
        data.append("location", formData.location);
        data.append("category", formData.category);
        data.append("totalSeats", formData.totalSeats);
        data.append("ticketPrice", formData.ticketPrice);
        data.append("time", formData.time);

        if (formData.image) {

          data.append(
            "image",
            formData.image
          );

        }

        /* ✅ REAL API CALL */

        await api.post(
          "/events",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        /* Reset */

        setShowEventForm(false);

        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: '',
          totalSeats: '',
          ticketPrice: '',
          image: null,
          time: '',
        });

        fetchData();

      } catch (error: any

      ) {

        alert(
          error.response?.data?.message
          || "Error creating event"
        );

      }

    };




  /* ✅ Delete Event */

  const handleDeleteEvent =
    async (
      id: string
    ): Promise<void> => {

      if (
        window.confirm(
          'Are you sure you want to delete this event?'
        )
      ) {

        try {

          await api.delete(
            `/events/${id}`
          );

          fetchData();

        } catch (error) {

          alert('Error deleting event');

        }

      }

    };

  /* ✅ Confirm Booking */



  /* ✅ Cancel Booking */

  const handleCancelBooking =
    async (
      id: string
    ): Promise<void> => {

      if (
        window.confirm(
          "Cancel this user's booking request?"
        )
      ) {

        try {

          await api.delete(
            `/booking/${id}`
          );

          fetchData();

        } catch (error: any) {

          alert(
            error.response?.data?.message ||
            'Error cancelling booking'
          );

        }

      }

    };

  /* ✅ Loading */

  if (loading) {

    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading admin panel...
      </div>
    );

  }

  /* ✅ UI remains same below */

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage events and manually confirm bookings.</p>
        </div>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="w-full md:w-auto bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition shadow-md"
        >
          {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-green-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">₹</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Paid Clients</p>
            <h3 className="text-3xl font-black text-blue-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">👤</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1"> Total Bookings</p>
            <h3 className="text-3xl font-black text-yellow-600">{bookings.length}</h3>
          </div>
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">⏳</div>
        </div>
      </div>

      {showEventForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animation-slideDown">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required type="text" placeholder="Event Title" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            <input required type="text" placeholder="Category (e.g., Tech, Music)" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            <input required type="date" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            <input required type="text" placeholder="Location" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            <input required type="number" placeholder="Total Seats" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
            <input required type="number" placeholder="Ticket Price (0 for free)" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
            <input required type="time" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />

            <div className="md:col-span-2">

              <input
                type="file"
                accept="image/*"
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"

                onChange={(e) => {

                  if (e.target.files) {

                    setFormData({

                      ...formData,

                      image: e.target.files[0]

                    });

                  }

                }}

              />

            </div>

            <textarea required placeholder="Event Description" className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <button type="submit" className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition shadow-md">Publish Event</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">{events.length}</span>
            All Events
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {events.length === 0 ? <li className="p-6 text-gray-500 text-center">No events created yet.</li> :
                events.map(event => (
                  <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 leading-tight">{event.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1 font-medium"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {new Date(event.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 font-medium"><div className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> {event.availableSeats}/{event.totalSeats} seats</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm shrink-0">
                      Delete
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">{bookings.length}</span>
            Booking Requests
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {bookings.length === 0 ? <li className="p-6 text-gray-500 text-center">No bookings yet.</li> :
                bookings.map(booking => (
                  <li key={booking._id} className={`p-6 hover:bg-gray-50 transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                      <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
                        <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                        {booking.status !== 'cancelled' && <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-800'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100 text-sm">
                      <p className="text-gray-700 flex items-center gap-2 mb-1">
                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">User:</span>
                        <span className="font-semibold">{booking.userId?.name}</span>
                        <span className="text-gray-400">({booking.userId?.email})</span>
                      </p>
                      <p className="text-gray-700 flex items-center gap-2 mb-1">
                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">Amount:</span>
                        <span className={`font-semibold ${booking.amount === 0 ? 'text-green-600' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                      </p>
                      <p className="text-gray-700 flex items-center gap-2 mb-1">
                        <span className="font-bold w-16 text-gray-500 uppercase text-xs">Date:</span>
                        <span>{new Date(booking.createdAt).toLocaleString()}</span>
                      </p>
                      {booking.eventId && (
                        <p className="text-gray-700 flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <span className="font-bold w-16 text-gray-500 uppercase text-xs">Seats:</span>
                          <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                        </p>
                      )}
                    </div>

                    {/* Action buttons for admin */}
                    {booking.status === 'pending' && (
                      <div className="flex flex-wrap gap-2 mt-2">

                        <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;