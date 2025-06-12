import { auth } from "@/FirebaseConfig";
import { router } from "expo-router";
import { TouchableOpacity, Text, SafeAreaView, StyleSheet } from "react-native";

// the Setting tab is going to have signout and help

//#################################################################################
// try to figure out why the application does not sing out back to the login page
// ################################################################################
const Setting = () => {
  const signOut = async () => {
    try {
      await auth.signOut();
      router.replace("/");
      alert("Sign out successful");
    } catch (error) {
      console.log(error);
      alert("Sign out failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.helpButton]}>
        <Text style={styles.buttonText}>Help & Support</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    maxWidth: 320,
    height: 60,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  helpButton: {
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
