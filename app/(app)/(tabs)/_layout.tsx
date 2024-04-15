import { getUserMutation, getUserQuery } from "@/api/userApi"
import supabase from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Tabs, useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Button,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FontAwesome6 } from "@expo/vector-icons"

export default function _layout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: user } = useQuery(getUserQuery())
  const { mutate: createUser, isPending } = useMutation(getUserMutation())

  const onSave = async () => {
    if (!username) return Alert.alert("Name is required")
    createUser(
      { username },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: getUserQuery().queryKey }),
        onError: err => Alert.alert(err.message),
      }
    )
  }

  const [username, setUsername] = useState("")

  if (!user)
    return (
      <SafeAreaView>
        <TextInput
          value={username}
          onChangeText={(text: string) => setUsername(text)}
          className="border border-black p-2 m-2"
        />
        <Button disabled={isPending} title="Save" onPress={onSave} />
      </SafeAreaView>
    )
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
          ),
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finances"
        options={{
          title: "Finances",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-link"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <TouchableOpacity
              onPress={e => {
                e.preventDefault()
                router.push("/(app)/create")
              }}
            >
              <AntDesign name="pluscircleo" size={24} color={color} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="party-popper"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chores"
        options={{
          title: "Chores",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="person-digging" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
