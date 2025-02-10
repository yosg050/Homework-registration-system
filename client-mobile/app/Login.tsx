import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from "axios";
import Popup from "./Popup";
import { serverIp } from "./ips";
import Fontisto from "@expo/vector-icons/Fontisto";
import Feather from "@expo/vector-icons/Feather";

export default function Login({ setIsSignUp }) {
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

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

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

  const send = async () => {
    console.log("formData:", formData);

    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(`${serverIp}/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Success:", response.data);
      showPopup(response.data.sentence, "Successfully connected", "#22C55E");
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      showPopup("An error occurred. Please try again.", "Error", "#EF4444");
    }
  };

  const isFormValid = formData.email && formData.password;

  const closePopup = () => {
    setPopupData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

      <View style={styles.inputContainer}>
        <Fontisto name="email" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.inputIcon}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={handleChange("email")}
          value={formData.email}
          textAlign="left"
        />
      </View>

      <View style={styles.passwordContainer}>
        <Feather name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={handleChange("password")}
          value={formData.password}
          textAlign="left"
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={togglePassword}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!isFormValid}
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={send}
      >
        <Text
          style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}
        >
          Log in
        </Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#DB4437" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome5 name="facebook" size={20} color="#1877F2" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsSignUp(true)}
        style={styles.buttonWhite}
      >
        <Text style={styles.socialText}>Register</Text>
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
  container: { padding: 20, alignItems: "center", width: "100%" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#4338CA",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
    marginVertical: 10,
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
  inputPassword: { flex: 1,  paddingVertical: 12,},
  eyeIcon: { padding: 10 },
  forgotPassword: {
    color: "#4338CA",
    width: "100%",
    marginBottom: 10,
    textAlign: "left",
  },

  buttonWhite: {
    flexDirection: "row",

    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 40,
    padding: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    width: "100%",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  line: { flex: 1, height: 1, backgroundColor: "#D1D5DB" },
  orText: { marginHorizontal: 10, color: "#666" },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 40,
    padding: 10,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  socialText: { marginLeft: 8, fontSize: 14, fontWeight: "bold" },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    marginVertical: 15,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#A5B4FC",
  },

  buttonTextDisabled: {
    color: "#E0E7FF",
  },

  registerText: { marginVertical: 15, color: "#666" },
  registerButton: { marginLeft: 5, padding: 5 },
  registerButtonText: { color: "#4F46E5", fontWeight: "bold" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
    width: "100%",
    marginBottom: 10,
  },
  icon: {
    
    marginRight: 10,
    marginLeft: 10,
    width: 20,
    textAlign: "center",
  },
  inputIcon: {
    flex: 1,
    paddingVertical: 12,
  },
});
