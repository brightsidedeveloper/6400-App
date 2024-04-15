import {
  View,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native"
import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { getTicketMutation } from "@/api/ticketApi"
import { useRouter } from "expo-router"
import { z } from "zod"

const types = [
  { value: "purchase", label: "Pitch In" },
  { value: "event", label: "Event" },
  { value: "chore", label: "Chore" },
]

const TicketSubmissionSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.string(),
  type: z.string(),
  amount: z.number().optional(),
})

export default function create() {
  const router = useRouter()
  const { mutate: createTicket } = useMutation(getTicketMutation())

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("")
  const [amount, setAmount] = useState(0)

  const submitTicket = async () => {
    const newTicket = { title, description, date, type, amount }
    try {
      TicketSubmissionSchema.parse(newTicket)
      createTicket(newTicket, {
        onSuccess() {
          router.back()
        },
        onError(err) {
          Alert.alert(err.message)
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

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
      <TouchableOpacity onPress={submitTicket}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}
