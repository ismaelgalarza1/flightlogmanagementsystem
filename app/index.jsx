import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Index = () => {
  //set my const use state for my email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // the sign up function will be async and have to use try and wait

  return (
    //this if going to be the login page with a drone image in the background.
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flightlog Management System</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        onChangeText={setEmail}></TextInput>
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry></TextInput>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Register</Text>
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
    width: "60%",
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "50%",
    height: 60,
    marginVertical: 15,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 20,
    evelation: 5,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
