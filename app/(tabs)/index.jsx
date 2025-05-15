import { Text } from "react-native";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Main() {
  // if not the user the router will be redirected to the login page.
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace("/");
  });
  return (
    <SafeAreaView>
      <Text>Entered the application after login</Text>
    </SafeAreaView>
  );
}
