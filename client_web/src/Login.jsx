import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { serverIp } from "./ips";
import Popup from "./Popup";
import axios from "axios";

function Login({ setIsSignUp }) {
  const [popupData, setPopupData] = useState({
    isOpen: false,
    title: "",
    message: "",
    color: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showPopup = (message, title = "Notification", color = "blue-500") => {
    setPopupData({
      isOpen: true,
      title: title,
      message: message,
      color: color,
    });
  };

  const isFormValid = formData.email && formData.password;

  const send = async () => {
    console.log("formData:", formData);

    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        `${serverIp}/login`,

        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Success:", response.data);

      showPopup(response.data.sentence, "Successfully connected", "green-300");

      return response.data;
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      showPopup("An error occurred. Please try again.", "Error", "red-500");
    }
  };

  const closePopup = () => {
    setPopupData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-8  text-indigo-700 text-sm">
        Log in
      </h2>

      <form className="space-y-1">
        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-1 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 "
          >
            <FaRegEye className="text-gray-500 cursor-pointer" />
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <a href="#" className="text-indigo-700 text-xs cursor-pointer">
            Forgot password?
          </a>
        </div>
      </form>

      <button
        type="button"
        className="w-full bg-blue-600 text-white py-1 rounded-3xl hover:bg-blue-700 transition-colors text-xs cursor-pointer"
        onClick={send}
        disabled={!isFormValid}
      >
        Log in
      </button>

      {/* Or Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button className="flex items-center justify-center px-2 py-1 border border-blue-600 rounded-3xl hover:bg-gray-50 text-xs cursor-pointer">
          <FcGoogle className="w-4 h-4 mr-4" />
          <span className="text-xs text-blue-500 text-indigo-700">Google</span>
        </button>

        <button className="flex items-center justify-center px-2  py-1 border border-blue-600 rounded-3xl hover:bg-gray-50 text-xs cursor-pointer">
          <FaFacebook className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-xs text-blue-500 text-indigo-700">
            Facebook
          </span>
        </button>
      </div>

      {/* Register Link */}
      <div className="text-center text-xs flex justify-center items-center flex-col">
        <span className="text-gray-600 m-2">Have no account yet? </span>
        <button
          onClick={() => setIsSignUp(true)}
          className=" w-full flex items-center justify-center px-3 py-1  border border-blue-600 rounded-xl hover:bg-blue-50 text-xs cursor-pointer"
        >
          Register
        </button>
      </div>

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

export default Login;
