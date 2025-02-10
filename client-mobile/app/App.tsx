import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Login from "./Login";
import SignUp from "./SignUp";
import icon from "./../assets/images/icon.png";

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.box}>
        <View style={styles.rightSection}>
          {isSignUp ? (
            <SignUp setIsSignUp={setIsSignUp} />
          ) : (
            <Login setIsSignUp={setIsSignUp} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 90,
    alignItems: "center",
    width: "100%",
  },
  icon: {
    width: 60,
    height: 60,
  },
  box: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    width: "90%",
    maxWidth: 500,
    paddingTop: 10,
  },
  rightSection: {
    flex: 1,
    padding: 20,
  },
});
