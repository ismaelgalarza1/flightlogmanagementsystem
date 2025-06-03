//build the layout for the tabs need home, flightlog, documents and settings
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

//create the bottom navigation of the application.
const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007BFF",
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="flightlog"
        options={{
          title: "FlightLog",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plane" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="gear" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
