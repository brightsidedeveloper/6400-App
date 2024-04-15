import { View, Text, TextInput, Touchable, TouchableOpacity, Alert, Button } from 'react-native'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getTicketMutation, ticketTypes } from '@/api/ticketApi'
import { useRouter } from 'expo-router'
import { z } from 'zod'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

const TicketSubmissionSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string(),
  date: z.string().min(1, { message: 'Date is required' }),
  type: z.string(),
  amount: z.number().optional(),
})

export default function create() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: createTicket } = useMutation(getTicketMutation())

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date())
  const [type, setType] = useState(ticketTypes[0].value)
  const [amount, setAmount] = useState(0)

  const submitTicket = async () => {
    const newTicket = { title, description, date: date.toISOString(), type, amount }
    try {
      TicketSubmissionSchema.parse(newTicket)
      createTicket(newTicket, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['ticket'] })
          router.back()
          // @ts-ignore
          router.push(`/(app)/(tabs)/${type}s`)
        },
        onError(err) {
          Alert.alert(err.message)
        },
      })
    } catch (err) {
      try {
        // @ts-ignore
        Alert.alert(JSON.parse(err.message)[0].message)
      } catch (err) {
        Alert.alert('An error occurred')
      }
    }
  }

  return (
    <View className='p-2 flex-col gap-2'>
      <Text className='text-2xl font-bold mb-5 underline'>Create a Ticket</Text>
      <View>
        <Text className='font-bold'>Title</Text>
        <TextInput className='p-2 rounded-md border border-blue-500' value={title} onChangeText={(text: string) => setTitle(text)} />
      </View>
      <View>
        <Text className='font-bold'>Description</Text>
        <TextInput value={description} className='p-2 rounded-md border border-blue-500 min-h-64' multiline numberOfLines={7} onChangeText={(text: string) => setDescription(text)} />
      </View>
      <View>
        <Text className='font-bold'>Date</Text>
        <DateTimePicker value={date} mode='datetime' onChange={(_: DateTimePickerEvent, date?: Date | undefined) => date && setDate(date)} />
      </View>
      <View>
        <Text className='font-bold'>Type</Text>
        <View>
          <Text>{ticketTypes.find(t => type === t.value)?.label ?? 'Select a Type'}</Text>
          <View>
            {ticketTypes.map(t => (
              <Button key={t.value} title={t.label} onPress={() => setType(t.value)} />
            ))}
          </View>
        </View>
      </View>
      {type === 'finance' && (
        <View>
          <TextInput className='p-2 rounded-md border border-blue-500' value={String(amount)} onChangeText={(text: string) => !isNaN(Number(text)) && setAmount(Number(text))} />
        </View>
      )}
      <TouchableOpacity className='ml-auto' onPress={submitTicket}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}
