import { auth } from "@/FirebaseConfig";
import { router } from "expo-router";
import { TouchableOpacity, Text, SafeAreaView, StyleSheet } from "react-native";

// the Setting tab is going to have signout and help

//############### try to figure out why the application does not sing out back to the login page ##########################
const Setting = () => {
  const signOut = async () => {
    try {
      await auth.signOut();
      router.replace("/"); // Redirect to the login page after sign out
      alert("Sign out successful");
    } catch (error) {
      console.log(error);
      alert("Sign out failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  button: {
    width: "70%",
    height: 60,
    marginVertical: 15,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 20,
    evelation: 5,
  },
});
