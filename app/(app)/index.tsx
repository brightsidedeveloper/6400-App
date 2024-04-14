import { getUserQuery } from '@/api/userApi'
import { useQuery } from '@tanstack/react-query'
import { SafeAreaView, Text } from 'react-native'

export default function index() {
  const { data: user } = useQuery(getUserQuery())

  return (
    <SafeAreaView className='flex-1 items-center justify-center'>
      <Text className='text-blue-500 text-3xl'>Hello, {user.username}!</Text>
    </SafeAreaView>
  )
}
