import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { name, phone });
      setSessionId(res.data.sessionId);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const verifyOtp = async () => {
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        phone,
        otp,
        sessionId,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="card p-4 shadow w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Signup</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="+91..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {!otpSent && (
          <div className="d-grid mb-3">
            <button className="btn btn-primary" onClick={sendOtp}>
              Send OTP
            </button>
          </div>
        )}

        {otpSent && (
          <>
            <input
              className="form-control mb-3"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="d-grid">
              <button className="btn btn-success" onClick={verifyOtp}>
                Verify OTP
              </button>
            </div>
          </>
        )}
        <Link   to='/login' className='text-center'>Login</Link>
      </div>
    </div>
  );
}
