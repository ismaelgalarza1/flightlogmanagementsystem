import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  Button,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Modal state and registration fields
  const [modalVisible, setModalVisible] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [medicalExamDate, setMedicalExamDate] = useState("");

  const signUp = async () => {
    setModalVisible(true);
  };

  const handleRegister = async () => {
    // Validate MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(medicalExamDate)) {
      alert("Date of Medical Exam must be in MM/DD/YYYY format.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        regEmail,
        regPassword
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: regEmail,
        licenseNumber,
        medicalExamDate,
      });
      // await addDoc(collection(db, "users"), {
      //   uid: user.uid,
      //   email: regEmail,
      //   licenseNumber,
      //   medicalExamDate,
      // });
      setModalVisible(false);
      router.replace("/");
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("(tabs)/home");
    } catch (error) {
      alert("Sign in failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flightlog Management System</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signUp}>
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>

      {/* Registration Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Register</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={regEmail}
              onChangeText={setRegEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={regPassword}
              onChangeText={setRegPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.textInput}
              placeholder="FAA License Number"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Date of Medical Exam"
              value={medicalExamDate}
              onChangeText={setMedicalExamDate}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Submit" onPress={handleRegister} />
              <Button
                title="Cancel"
                color="gray"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;

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
    width: "75%",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000000aa",
  },
  modalContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 30,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
