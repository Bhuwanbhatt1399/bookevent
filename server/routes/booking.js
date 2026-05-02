import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js'

import {
    bookEvent,
    
    getMyBookings,
    cancelBooking,
    getAllBookings,
    createPaymentOrder
} from '../controllers/bookingControllers.js'



router.post('/create-order', protect, createPaymentOrder);
router.get('/mybooking', protect, getMyBookings);
router.get('/all', protect, admin, getAllBookings);
router.post('/', protect, bookEvent);
router.delete('/:id', protect, cancelBooking);





export default router;




