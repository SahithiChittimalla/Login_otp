import React from "react";

const MobileInput = ({ mobile, onChange, onSubmit, disabled }) => {
  return (
    <div>
      <h2>Enter Mobile Number</h2>
      <input
        type="text"
        placeholder="Enter mobile number"
        maxLength="10"
        value={mobile}
        onChange={onChange}
        disabled={disabled}
      />
      <button onClick={onSubmit} disabled={disabled}>
        Submit
      </button>
    </div>
  );
};

export default MobileInput;
