const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateToken } = require('../utils/jwt');

const API_KEY = 'e591cd6d-250c-11f0-8b17-0200cd936042';

const users = {}; // { "+919999999999": { name, phone } }

router.post('/signup', async (req, res) => {
  const { name, phone } = req.body;
  const mobile = phone.replace('+91', '');

  users[phone] = { name, phone };

  try {
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${mobile}/AUTOGEN`;
    const response = await axios.get(url);
    res.json({ sessionId: response.data.Details });
  } catch {
    res.status(500).json({ error: 'OTP sending failed' });
  }
});

router.post('/login', async (req, res) => {
  const { phone } = req.body;
  const mobile = phone.replace('+91', '');

  if (!users[phone]) return res.status(404).json({ error: 'User not found' });

  try {
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${mobile}/AUTOGEN`;
    const response = await axios.get(url);
    res.json({ sessionId: response.data.Details });
  } catch {
    res.status(500).json({ error: 'OTP sending failed' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { phone, sessionId, otp } = req.body;

  axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`)
    .then((response) => {
      if (response.data.Details === 'OTP Matched') {
        const user = users[phone];
        const token = generateToken({ name: user.name, phone: user.phone });
        res.json({ token, user });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    })
    .catch(() => {
      res.status(500).json({ error: 'OTP verification failed' });
    });
});

module.exports = router;
