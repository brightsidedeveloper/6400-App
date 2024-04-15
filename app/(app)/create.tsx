import {
  View,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native"
import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { getTicketMutation } from "@/api/ticketApi"

const types = [
  { value: "purchase", label: "Pitch In" },
  { value: "event", label: "Event" },
  { value: "chore", label: "Chore" },
]

export default function create() {
  const { mutate: createTicket } = useMutation(getTicketMutation())

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("")
  const [amount, setAmount] = useState(0)

  return (
    <View>
      <Text>Create a Ticket</Text>
      <TextInput
        value={title}
        onChangeText={(text: string) => setTitle(text)}
      />
      <TextInput
        value={description}
        onChangeText={(text: string) => setDescription(text)}
      />
      <TouchableOpacity>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}
