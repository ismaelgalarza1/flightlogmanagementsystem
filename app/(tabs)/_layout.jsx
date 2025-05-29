//build the layout for the tabs need home, flightlog, documents and settings

import { Tabs } from "expo-router";

//create the bottom navigation of the application.
const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="flightlog"
        options={{
          title: "FlightLog",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
