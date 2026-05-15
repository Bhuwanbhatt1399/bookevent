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
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));




//  ROUTES 


app.use('/api/auth', authroutes);

app.use('/api/events', eventroutes);

app.use('/api/booking', bookingroutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Error:", err);
    process.exit(1);
  });

// SERVER 

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server is running on port ${PORT}`
  );

});