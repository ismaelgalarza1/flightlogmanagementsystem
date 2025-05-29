import React, { useState, useEffect } from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import firestore from "@react-native-firebase/firestore";

// Placeholder user ID
const USER_ID = "sampleUserId123";

export default function Home() {
  const [userData, setUserData] = useState("");

  // useEffect(() => {
  //   const unsubscribe = firestore()
  //     .collection("users")
  //     .doc(USER_ID)
  //     .onSnapshot((doc) => {
  //       if (doc.exists) {
  //         setUserData(doc.data());
  //       }
  //     });

  //   return () => unsubscribe();
  // }, []);

  if (userData) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const {
    name,
    licenseNumber,
    totalHours,
    lastMedicalExam,
    lastFlown,
    profileImage,
  } = userData;

  const currencyStatus = getCurrencyStatus(lastFlown);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.info}>FAA License #: {licenseNumber}</Text>
      <Text style={styles.info}>Total Hours Flown: {totalHours}</Text>
      <Text style={styles.info}>Last Medical Exam: {lastMedicalExam}</Text>
      <Text style={styles.info}>Last Time Flown: {lastFlown}</Text>
      <Text
        style={[
          styles.status,
          currencyStatus === "Current" ? styles.current : styles.due,
        ]}>
        Status: {currencyStatus}
      </Text>
    </SafeAreaView>
  );
}

function getCurrencyStatus(lastFlown) {
  const daysSince = Math.floor(
    (new Date() - new Date(lastFlown)) / (1000 * 60 * 60 * 24)
  );
  return daysSince <= 30 ? "Current" : "Currency Due";
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    marginTop: 5,
  },
  status: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
  },
  current: {
    color: "green",
  },
  due: {
    color: "red",
  },
});
