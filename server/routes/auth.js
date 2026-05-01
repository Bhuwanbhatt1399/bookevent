import express from 'express';

const router = express.Router();

import {
  registerUser,
  loginUser,
  verifyUser
} from '../controllers/authControllers.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyUser);


export default router;