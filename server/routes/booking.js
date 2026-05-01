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



router.post('/', protect, bookEvent);
router.get('/mybooking', protect, getMyBookings);

router.delete('/:id', protect, cancelBooking);
router.get('/all', protect, admin, getAllBookings);
router.post('/create-order', protect, createPaymentOrder);



export default router;




