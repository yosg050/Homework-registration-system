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
import Popup from "./Popup"; // הוספת רכיב ה-Popup להצגת הודעות
import { serverIp } from "./ips"; // הוספת כתובת השרת

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

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={handleChange("email")}
        value={formData.email}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={handleChange("password")}
          value={formData.password}
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
        <Text style={styles.buttonText}>Log in</Text>
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
  inputPassword: { flex: 1, padding: 10 },
  eyeIcon: { padding: 10 },
  forgotPassword: {
    color: "#4338CA",
    textAlign: "right",
    width: "100%",
    marginBottom: 10,
  },
  button: {
    marginVertical: 15,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
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
  registerText: { marginVertical: 15, color: "#666" },
  registerButton: { marginLeft: 5, padding: 5 },
  registerButtonText: { color: "#4F46E5", fontWeight: "bold" },
});

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import { Ionicons } from "@expo/vector-icons";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// export default function Login({ setIsSignUp }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const togglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Log in</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//       />

//       <View style={styles.passwordContainer}>
//         <TextInput
//           style={styles.inputPassword}
//           placeholder="Password"
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity
//           style={styles.eyeIcon}
//         >
//           <Ionicons
//           onPress={togglePassword}
//             name={showPassword ? "eye" : "eye-off"}
//             size={20}
//             color="#666"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Forgot Password */}
//       <TouchableOpacity>
//         <Text style={styles.forgotPassword}>Forgot password?</Text>
//       </TouchableOpacity>

//       {/* Login Button */}
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Log in</Text>
//       </TouchableOpacity>

//       {/* Or Divider */}
//       <View style={styles.orContainer}>
//         <View style={styles.line} />
//         <Text style={styles.orText}>Or</Text>
//         <View style={styles.line} />
//       </View>

//       <View style={styles.socialButtons}>
//         <TouchableOpacity style={styles.socialButton}>
//           <FontAwesome name="google" size={20} color="#DB4437" />
//           <Text style={styles.socialText}>Google</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.socialButton}>
//           <FontAwesome5 name="facebook" size={20} color="#1877F2" />
//           <Text style={styles.socialText}>Facebook</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.registerContainer}>
//         <Text style={styles.registerText}>Don't have an account?</Text>
//       </View>

//       <TouchableOpacity
//         onPress={() => setIsSignUp(true)}
//         style={styles.buttonWhite}
//       >
//         <Text style={styles.socialText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
