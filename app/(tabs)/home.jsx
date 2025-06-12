import React, { useState, useEffect } from "react";
import { Text, Image, StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);
  const [lastFlown, setLastFlown] = useState(null);
  //#####################################################################
  // Helper function to format date as DDMMMYYYY = 02JAN2025
  //#####################################################################
  function formatDateDDMMMYYYY(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  }

  useEffect(() => {
    let unsubscribeLogs = null;
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        // Fetch user profile
        const q = doc(db, "users", user.uid);
        const docSnap = await getDoc(q);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
        // #################################################################
        //add a real time listner for the collections reference https://rnfirebase.io/database/usage
        // #################################################################
        const logsQuery = query(
          collection(db, "flightLogs"),
          where("userId", "==", user.uid)
        );
        unsubscribeLogs = onSnapshot(logsQuery, (logsSnap) => {
          let sum = 0;
          let latestDate = null;
          logsSnap.forEach((doc) => {
            const data = doc.data();
            if (typeof data.totalFlightHours === "number") {
              sum += data.totalFlightHours;
            }
            if (data.flightDate) {
              let date = new Date(data.flightDate);

              if (
                isNaN(date.getTime()) &&
                /^\d{2}\/\d{2}\/\d{4}$/.test(data.flightDate)
              ) {
                const [month, day, year] = data.flightDate.split("/");
                date = new Date(`${year}-${month}-${day}`);
              }
              if (!isNaN(date.getTime())) {
                if (!latestDate || date > latestDate) {
                  latestDate = date;
                }
              }
            }
          });
          setTotalHours(sum);
          // lastFlown is always the latest flight log date
          setLastFlown(
            latestDate ? latestDate.toISOString().split("T")[0] : null
          );
          setTotalHours(sum);
          setLastFlown(
            latestDate ? latestDate.toISOString().split("T")[0] : null
          );
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
        setTotalHours(0);
      }
      setLoading(false);
    };

    fetchUserData();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No user data found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}>
        {userData.profileImage && (
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.header}>Pilot Dashboard</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flight Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Total Hours Flown:</Text>
            <Text style={styles.value}>{totalHours}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Flight Date:</Text>
            <Text style={styles.value}>
              {lastFlown ? formatDateDDMMMYYYY(lastFlown) : "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Currency Status:</Text>
            <Text
              style={[styles.value, getCurrencyStatus(lastFlown).statusStyle]}>
              {getCurrencyStatus(lastFlown).statusText}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Medical Exam:</Text>
            <Text style={styles.value}>
              {userData.medicalExamDate || "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>License Number:</Text>
            <Text style={styles.value}>{userData.licenseNumber || "N/A"}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  //#####################################################################
  //add a currency status
  //#####################################################################
  function getCurrencyStatus(lastFlown) {
    if (!lastFlown) {
      return { statusText: "Status: Unknown", statusStyle: styles.due };
    }
    const daysSince = Math.floor(
      (new Date() - new Date(lastFlown)) / (1000 * 60 * 60 * 24)
    );
    if (daysSince <= 30) {
      return { statusText: "Status: Current", statusStyle: styles.current };
    } else {
      return {
        statusText: `Status: Overdue +${daysSince - 30} days`,
        statusStyle: styles.due,
      };
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  header: {
    fontSize: 26,
    fontWeight: "600",
    color: "#1a1a1a",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#2c3e50",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3436",
  },
  current: {
    color: "#27ae60",
  },
  due: {
    color: "#e74c3c",
  },
});
