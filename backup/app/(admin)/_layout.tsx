import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";

export default function AdminLayout() {
  const user = useSelector(selectUser);

  if (!user || user.role !== "admin") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Admin Dashboard",
        }}
      />
      <Stack.Screen
        name="create-dosen"
        options={{
          headerShown: true,
          title: "Create Dosen Account",
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="user-list"
        options={{
          headerShown: true,
          title: "Manage Users",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
