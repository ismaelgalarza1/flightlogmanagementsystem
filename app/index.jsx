import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const Index = () => {
  //set my const use state for my email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    //this if going to be the login page with a drone image in the background.
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flightlog Management System</Text>
      <TextInput style={styles.textInput} placeholder="Email"></TextInput>
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry></TextInput>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Index;

// the style sheet with be at the bottom of every page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  textInput: {
    width: "50%",
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "50%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
