import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { serverIp } from "./ips";
import Popup from "./Popup";
import axios from "axios";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";


function Login({ setIsSignUp }) {
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePassword = () => {
    setShowPassword(!showPassword);
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

        <div className="relative flex items-center border mt-5 border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 ">
          <MdOutlineMailOutline className="absolute left-3 text-gray-500 text-sm" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-10  px-6 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="relative flex items-center border mt-5 border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 ">
          <IoLockClosedOutline className="absolute left-3 text-gray-500 text-sm" />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-10 pr-10  px-6 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

        <div className="text-right">
          <a href="#" className="text-indigo-700 text-xs cursor-pointer">
            Forgot password?
          </a>
        </div>
      </form>

      <button
        type="button"
        onClick={send}
        disabled={!isFormValid}
        className={`w-full py-1 rounded-3xl text-white text-xs transition-colors 
    bg-blue-600 ${
      isFormValid ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
    }`}
      >
        Log in
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

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
