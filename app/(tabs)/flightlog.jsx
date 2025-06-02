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
      setLogs(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
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
  };

  const addOrUpdateLog = async () => {
    try {
      if (
        !flightNumber ||
        !operatorName ||
        !aircraftType ||
        !totalFlightHours
      ) {
        alert("All fields are required");
        return;
      }

      const logData = {
        flightNumber,
        operatorName,
        aircraftType,
        totalFlightHours: Number(totalFlightHours),
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
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>Flight: {item.flightNumber}</Text>
        <Text style={styles.itemText}>Operator: {item.operatorName}</Text>
        <Text style={styles.itemText}>Aircraft: {item.aircraftType}</Text>
        <Text style={styles.itemText}>
          Total Flight Hours: {item.totalFlightHours || "N/A"}
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Edit" onPress={() => openModal(item)} />
        <Button title="Delete" onPress={() => deleteLog(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 70 }}>
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
              placeholder="Operator Name"
              value={operatorName}
              onChangeText={setOperatorName}
            />
            <TextInput
              style={styles.input}
              placeholder="Aircraft Type"
              value={aircraftType}
              onChangeText={setAircraftType}
            />
            <TextInput
              style={styles.input}
              placeholder="Total Hours"
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
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  buttonGroup: {
    justifyContent: "space-around",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000000aa",
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 30,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  modalButtons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default FlightLog;
