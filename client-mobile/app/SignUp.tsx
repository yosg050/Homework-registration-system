import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Popup from "./Popup";
import { serverIp } from "./ips";

export default function SignUp({ setIsSignUp }) {
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

  const showPopup = (message, title = "Notification", color = "#3B82F6") => {
    setPopupData({
      isOpen: true,
      title: title,
      message: message,
      color: color,
    });
  };

  const handleChange = (fieldName) => (value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

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
         "#22C55E"
      );

      return response.data;
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      showPopup("An error occurred. Please try again.", "Error", "#EF4444");
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
    <View>
      <TouchableOpacity onPress={() => setIsSignUp(false)}>
        <Text style={styles.closeButton}>X</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={handleChange("firstName")}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={handleChange("lastName")}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={handleChange("email")}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={handleChange("password")}
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <Ionicons
            onPress={togglePassword}
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={handleChange("confirmPassword")}
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <Ionicons
            onPress={togglePassword}
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={{ minHeight: 20 }}>
        {formData.password && formData.confirmPassword && !passwordsMatch && (
          <Text style={styles.errorText}>The passwords do not match</Text>
        )}
      </View>

      <TouchableOpacity
        disabled={!isFormValid}
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={send}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Popup
        isOpen={popupData.isOpen}
        onClose={closePopup}
        title={popupData.title}
        message={popupData.message}
        color={popupData.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: { textAlign: "right", fontSize: 20, color: "red" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#4338CA",
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    marginVertical: 15,
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A5B4FC",
  },

  buttonText: { color: "white", fontWeight: "bold" },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    minHeight: 20,
    textAlign: "center",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#F9FAFB",
    marginVertical: 10,
  },
  eyeIcon: { padding: 10 },
  inputPassword: { flex: 1, padding: 10 },
});
