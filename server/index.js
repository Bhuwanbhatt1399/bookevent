import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import authroutes from './routes/auth.js';
import eventroutes from './routes/events.js';
import bookingroutes from './routes/booking.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: "https://bookevent-three.vercel.app",
  credentials: true
}));


/*  VERY IMPORTANT — uploads static folder */



/* ================= ROUTES ================= */

app.use('/api/auth', authroutes);

/*  tumne "/" miss kiya tha */
app.use('/api/events', eventroutes);

app.use('/api/booking', bookingroutes);

/* ================= DATABASE ================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log('Connected to MongoDB');

})

.catch((error) => {

  console.log(
    "Error connecting to MongoDB:",
    error
  );

});

/* ================= SERVER ================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server is running on port ${PORT}`
  );

});