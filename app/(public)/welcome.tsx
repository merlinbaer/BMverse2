import { Button } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Link href="/login" replace asChild>
        <Button title="Login" />
      </Link>
    </SafeAreaView>
  );
}
