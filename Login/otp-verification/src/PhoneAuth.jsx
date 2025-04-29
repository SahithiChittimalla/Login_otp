import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCCvW9DhaLJrZi0ZFINPqb2o6crzW32vXU",
  authDomain: "login-31779.firebaseapp.com",
  projectId: "login-31779",
  storageBucket: "login-31779.appspot.com",
  messagingSenderId: "105702861894",
  appId: "1:105702861894:web:9272676171e7fefd7a2e47"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const PhoneAuth = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Step 1: Setup invisible reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA Solved:", response);
        },
        "expired-callback": () => {
          console.warn("reCAPTCHA expired. Try again.");
        },
      }, auth);
    }
  };

  // Step 2: Send OTP
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = "+91" + mobile;

    try {
      await appVerifier.verify(); // ✅ Important step
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error during signInWithPhoneNumber:", error);
      alert("Failed to send OTP. See console for details.");
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return alert("Please enter the OTP");

    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      // Optional: Send token to backend
      const response = await fetch("http://localhost:5000/verify_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (data.success) {
        alert("User authenticated successfully");
      } else {
        alert("Token verification failed");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Firebase OTP Login</h2>
      <input
        type="text"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp}>Verify OTP</button>

      {/* 🔥 reCAPTCHA container MUST be here */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
