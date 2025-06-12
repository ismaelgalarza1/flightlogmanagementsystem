import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";
//import { SafeAreaView } from "react-native-safe-area-context";

const FlightLog = () => {
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [flightNumber, setFlightNumber] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [aircraftType, setAircraftType] = useState("");
  const [totalFlightHours, setTotalFlightHours] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [flightDate, setFlightDate] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;
  const flightLogCollection = collection(db, "flightLogs");

  //####################################################################
  // this fetches all the log that is located in the firestore cloud db
  //#####################################################################

  useEffect(() => {
    if (user) fetchLogs();
  });

  const fetchLogs = async () => {
    try {
      const q = query(flightLogCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);
      const sortedLogs = data.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => {
          // Parse dates for sorting, fallback to 0 if missing reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
          const dateA = a.flightDate ? new Date(a.flightDate) : 0;
          const dateB = b.flightDate ? new Date(b.flightDate) : 0;
          return dateB - dateA;
        });
      setLogs(sortedLogs);
    } catch (error) {
      console.error("Error fetching flight logs:", error);
    }
  };
  //####################################################################
  // Modal and addlog or updates the flightlogs to the database
  //#####################################################################
  const openModal = (log = null) => {
    if (log) {
      setEditingId(log.id);
      setFlightNumber(log.flightNumber);
      setOperatorName(log.operatorName);
      setAircraftType(log.aircraftType);
      setTotalFlightHours(log.totalFlightHours);
      setFlightDate(log.flightDate);
    } else {
      // this will increase the number of log the ensd user will see.
      setEditingId(null);
      setFlightNumber((logs.length + 1).toString());
      setOperatorName("");
      setAircraftType("");
      setTotalFlightHours("");
    }
    setModalVisible(true);
  };

  const clearForm = () => {
    setEditingId(null);
    setFlightNumber("");
    setOperatorName("");
    setAircraftType("");
    setTotalFlightHours();
    setFlightDate("");
  };
  //####################################################################
  // need to REGEX for input validation for adding in the modal and updating
  //####################################################################
  const addOrUpdateLog = async () => {
    // Regex patterns
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // MM/DD/YYYY
    const numberRegex = /^\d+$/;
    const nameRegex = /^[a-zA-Z0-9\s\-]+$/;

    if (
      !flightNumber ||
      !operatorName ||
      !aircraftType ||
      !totalFlightHours ||
      !flightDate
    ) {
      alert("All fields are required");
      return;
    }
    if (!dateRegex.test(flightDate)) {
      alert("Flight Date must be in MM/DD/YYYY format.");
      return;
    }
    if (!numberRegex.test(flightNumber)) {
      alert("Flight Number must be numeric.");
      return;
    }
    if (!nameRegex.test(operatorName)) {
      alert("Operator Name contains invalid characters.");
      return;
    }
    if (!nameRegex.test(aircraftType)) {
      alert("Aircraft Type contains invalid characters.");
      return;
    }
    if (!numberRegex.test(totalFlightHours)) {
      alert("Total Hours must be numeric.");
      return;
    }

    try {
      const logData = {
        flightNumber,
        operatorName,
        aircraftType,
        totalFlightHours: Number(totalFlightHours),
        flightDate,
        userId: user.uid,
      };

      if (editingId) {
        const logDoc = doc(db, "flightLogs", editingId);
        await updateDoc(logDoc, logData);
      } else {
        await addDoc(flightLogCollection, logData);
      }

      fetchLogs();
      setModalVisible(false);
      clearForm();
    } catch (error) {
      console.error("Error saving flight log:", error);
    }
  };
  //####################################################################
  // This will delete the flight log fron the database
  //#####################################################################
  const deleteLog = async (id) => {
    try {
      const logDoc = doc(db, "flightLogs", id);
      await deleteDoc(logDoc);
      fetchLogs();
    } catch (error) {
      console.error("Error deleting flight log:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Flight #{item.flightNumber}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{item.flightDate || "N/A"}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Operator:</Text>
        <Text style={styles.value}>{item.operatorName}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Aircraft:</Text>
        <Text style={styles.value}>{item.aircraftType}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Total Hours:</Text>
        <Text style={styles.value}>
          {item.totalFlightHours != null ? item.totalFlightHours : "N/A"}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Button title="Edit" onPress={() => openModal(item)} />
        <Button
          title="Delete"
          color="#e74c3c"
          onPress={() => deleteLog(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 60 }}>
      <Text style={styles.header}>Flight Log</Text>
      <Button title="Add Flight Log" onPress={() => openModal()} />

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Flight Log" : "New Flight Log"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Flight Number"
              value={flightNumber}
              onChangeText={setFlightNumber}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Flight Date (MM/DD/YYYY)"
              placeholderTextColor={"#9F9FA0"}
              value={flightDate}
              onChangeText={setFlightDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Operator Name"
              placeholderTextColor={"#9F9FA0"}
              value={operatorName}
              onChangeText={setOperatorName}
            />
            <TextInput
              style={styles.input}
              placeholder="Aircraft Type"
              placeholderTextColor={"#9F9FA0"}
              value={aircraftType}
              onChangeText={setAircraftType}
            />
            <TextInput
              style={styles.input}
              placeholder="Total Hours"
              placeholderTextColor={"#9F9FA0"}
              value={totalFlightHours}
              onChangeText={setTotalFlightHours}
            />
            <View style={styles.modalButtons}>
              <Button title="Save" onPress={addOrUpdateLog} />
              <Button
                title="Cancel"
                color="gray"
                onPress={() => {
                  setModalVisible(false);
                  clearForm();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa", // light background
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    color: "#6b6b6b",
    fontSize: 15,
  },
  value: {
    color: "#2a2a2a",
    fontSize: 15,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 18,
    color: "#1a1a1a",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    fontSize: 15,
    color: "#2a2a2a",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default FlightLog;
