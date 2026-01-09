import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function Bio() {
  useEffect(() => {
    console.log("✅ Interests screen is rendering");
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "yellow", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 32, color: "black" }}>Bio</Text>
    </View>
  );
}
