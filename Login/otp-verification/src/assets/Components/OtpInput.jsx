import React from "react";

const OtpInput = ({ otp, onChange, onVerify, disabled }) => {
  return (
    <div>
      <h3>Enter OTP</h3>
      <input
        type="text"
        placeholder="Enter OTP"
        maxLength="6"
        value={otp}
        onChange={onChange}
      />
      <button onClick={onVerify} disabled={disabled}>
        Verify OTP
      </button>
    </div>
  );
};

export default OtpInput;
