import { TTicket, ticketTypes } from '@/api/ticketApi'
import { getUserQuery } from '@/api/userApi'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { Button } from 'react-native-elements'

export default function Ticket({ id, title, description, user_id, status, type, full, date, amount }: TTicket & { full?: boolean }) {
  const router = useRouter()
  const { data: user } = useQuery(getUserQuery(user_id))
  return (
    <TouchableOpacity className='p-2 border-b border-black' onPress={() => !full && router.push(`/(app)/${id}`)}>
      <View className='flex-row justify-between'>
        <View className='flex-row gap-1'>
          <Text>{user?.username}</Text>
          <Text>{title}</Text>
        </View>
        <View className='flex-col items-end gap-1'>
          <Text className='bg-red-500 text-white rounded-full p-1'>{status}</Text>
          <Text>{ticketTypes.find(({ value }) => value === type)?.label ?? 'Unknown'}</Text>
        </View>
      </View>
      {description && <Text>{full ? description : description.slice(0, 32)}</Text>}
      {full && <Text>{date}</Text>}
      {amount && (
        <View className='flex-row gap-1'>
          <Text>{amount}</Text>
          {user?.venmo && <Button title='Pay' onPress={() => Linking.openURL(`https://venmo.com/${user.venmo}?txn=pay&note=${title}&amount=${amount}`)} />}
        </View>
      )}
    </TouchableOpacity>
  )
}
