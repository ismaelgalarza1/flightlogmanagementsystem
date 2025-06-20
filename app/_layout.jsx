import { Stack } from "expo-router";
// import { useColorScheme } from "react-native";

//######################################################################
// This is the root layout for the application
//######################################################################
const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
