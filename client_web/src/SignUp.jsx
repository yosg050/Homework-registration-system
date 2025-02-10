import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from "axios";
import Popup from "./Popup";
import { serverIp } from "./ips";

function SignUp({ setIsSignUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const [popupData, setPopupData] = useState({
    isOpen: false,
    title: "",
    message: "",
    color: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const showPopup = (message, title = "Notification", color = "blue-500") => {
    setPopupData({
      isOpen: true,
      title: title,
      message: message,
      color: color,
    });
  };

  const send = async () => {
    console.log("formData:", formData);

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        `${serverIp}/register`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Success:", response.data);

      showPopup(
        response.data.sentence,
        "User successfully registered",
        "green-300"
      );

      return response.data;
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      showPopup("An error occurred. Please try again.", "Error", "red-500");
    }
  };

  const allFieldsFilled =
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.firstName &&
    formData.lastName;

  const isFormValid = allFieldsFilled && passwordsMatch;

  const closePopup = () => {
    setPopupData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative ">
      <div className="flex justify-end">
        <button onClick={() => setIsSignUp(false)}>x</button>
      </div>

      <h2 className="text-xl font-semibold text-center mb-8  text-indigo-700 text-sm">
        Sign Up
      </h2>
      <div className="space-y-2">
        <form className="space-y-3">
          {/* Email Input */}
          <div>
            <input
              value={formData.firstName}
              name="firstName"
              type="firstName"
              placeholder="first Name"
              onChange={handleChange}
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md   focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <input
              value={formData.lastName}
              name="lastName"
              type="LastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md   focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md   focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={togglePassword}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 "
            >
              {showPassword ? (
                <FaRegEyeSlash className="text-gray-500" />
              ) : (
                <FaRegEye className="text-gray-500" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-1 py-0.5 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={togglePassword}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 "
            >
              {showPassword ? (
                <FaRegEyeSlash className="text-gray-500" />
              ) : (
                <FaRegEye className="text-gray-500" />
              )}
            </button>
          </div>
          <div className="min-h-[20px]">
            {formData.password &&
              formData.confirmPassword &&
              !passwordsMatch && (
                <span className="text-red-500 text-sm font-bold">
                  The passwords do not match
                </span>
              )}
          </div>
        </form>
      </div>
      <button
        type="submit"
        disabled={!isFormValid}
        onClick={send}
        className={`w-full py-1 mt-5 text-sm rounded-3xl bg-blue-600 text-white hover:bg-blue-700 `}
      >
        Sign Up
      </button>
      <Popup
        isOpen={popupData.isOpen}
        onClose={closePopup}
        title={popupData.title}
        message={popupData.message}
        color={popupData.color}
      />
    </div>
  );
}

export default SignUp;
