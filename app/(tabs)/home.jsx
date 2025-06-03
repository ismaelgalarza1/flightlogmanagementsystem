import React, { useState, useEffect } from "react";
import { Text, Image, StyleSheet, ScrollView } from "react-native";
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

        // Listen for real-time updates to flight logs
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
              // If invalid, try parsing as MM/DD/YYYY
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
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {/* Optional: Show profile image if you want */}
        {userData.profileImage ? (
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
        ) : null}
        <Text style={styles.header}>Pilot Dashboard</Text>
        <Text style={[styles.info, { fontWeight: "bold" }]}>
          Total Hours Flown (from logs): {totalHours}
        </Text>
        <Text style={styles.info}>
          Last Flight Date: {lastFlown ? formatDateDDMMMYYYY(lastFlown) : "N/A"}
        </Text>
        <Text style={[styles.status, getCurrencyStatus(lastFlown).statusStyle]}>
          {getCurrencyStatus(lastFlown).statusText}
        </Text>
        <Text style={styles.info}>
          Medical Exam: {userData.medicalExamDate || "N/A"}
        </Text>
        <Text style={styles.info}>
          License Number: {userData.licenseNumber || "N/A"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
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
