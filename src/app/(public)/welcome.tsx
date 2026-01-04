import { Button, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function Page() {
  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link href="/login" replace asChild>
        <Button title="Login" />
      </Link>
    </ScrollView>
  );
}
