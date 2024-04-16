import { getContributorMutation, getContributorQuery } from '@/api/contributorApi'
import { TTicket, ticketTypes } from '@/api/ticketApi'
import { getAllUsersQuery, getUserQuery } from '@/api/userApi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { Button } from 'react-native-elements'
import Contributor, { NonContributor } from './Contributor'

export default function Ticket({ id, title, description, user_id, status, type, full, date, amount }: TTicket & { full?: boolean }) {
  const router = useRouter()
  const { data: allUsers } = useQuery(getAllUsersQuery())
  const { data: me } = useQuery(getUserQuery())
  const { data: user } = useQuery(getUserQuery(user_id))
  const { data: contributors } = useQuery(getContributorQuery(id))

  const isMyTicket = me?.id === user_id
  const isMyContribution = contributors?.some(({ user_id }) => user_id === me?.id)
  const nonContributors = allUsers?.filter(({ id }) => !contributors?.some(({ user_id }) => user_id === id) && id !== me?.id && isMyTicket)

  return (
    <TouchableOpacity className='p-2 border-b border-black' onPress={() => !full && router.push(`/(app)/${id}`)}>
      <View className='flex-row justify-between'>
        <View className='flex-row gap-1'>
          <Text>Creator: {user?.username}</Text>
          <Text>{title}</Text>
        </View>
        <View className='flex-col items-end gap-1'>
          <Text className='bg-red-500 text-white rounded-full p-1'>{status}</Text>
          <Text>{ticketTypes.find(({ value }) => value === type)?.label ?? 'Unknown'}</Text>
        </View>
      </View>
      {description && <Text>{full ? description : description.slice(0, 32)}</Text>}
      {full && <Text>{date}</Text>}
      {full &&
        contributors &&
        contributors.map(contributor => (
          <Contributor
            key={contributor.id}
            {...contributor}
            status={status}
            venmoLink={`https://venmo.com/${user.venmo}?txn=pay&note=${title}&amount=${amount / (contributors ? contributors.length + 1 : 1)}`}
          />
        ))}
      {full && nonContributors && status === 'open' && nonContributors.map(user => <NonContributor key={user.id} {...user} ticketId={id} />)}
      {amount && (
        <View className=''>
          <Text>Total: {amount}</Text>
          {full && <Text>Current Each: {amount / (contributors ? contributors.length + 1 : 1)}</Text>}
        </View>
      )}
    </TouchableOpacity>
  )
}
