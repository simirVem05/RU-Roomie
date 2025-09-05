import { Text, View } from "react-native";
import { Link } from 'expo-router';
import { SignOutButton } from "@/components/SignOutButton";

export default function Index() {
  return (
    <View className="bg-white justify-center items-center flex-1">
      <Text className="text-4xl my-10 text-primaryRed">Welcome to RU Roomie</Text>

      <Link href="/sign-in">Sign In</Link>
      <Link href="/likes">Likes</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/profile">Profile</Link>

      <SignOutButton/>
    </View>
  );
}
