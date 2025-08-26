import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import "../global.css"

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Drawer ke andar screens */}
        <Drawer.Screen
          name="(tab)"
          options={{
            title: "OralScan Ai",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="index"
          options={{
            title: "Main",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
