//build the layout for the tabs need home, flightlog, documents and settings

import { Tabs } from "expo-router";

//create the bottom navigation of the application.
const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Flightlog"
        options={{
          title: "FlightLog",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
