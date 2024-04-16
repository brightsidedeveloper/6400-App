import { TContributor, getContributorMutation } from '@/api/contributorApi'
import { TTicket } from '@/api/ticketApi'
import { getUserQuery } from '@/api/userApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { View, Text, TouchableOpacity, Linking } from 'react-native'

export default function Contributor({ user_id, payed, status, ticket_id, venmoLink }: TContributor & { status: TTicket['status']; venmoLink: string }) {
  const queryClient = useQueryClient()
  const { data: user } = useQuery(getUserQuery(user_id))
  const { mutate: pay } = useMutation(getContributorMutation(ticket_id))

  return (
    <View className='flex-row gap-2'>
      {user && (
        <>
          <Text>{user.username}</Text>
          <TouchableOpacity
            onPress={() =>
              !payed &&
              pay(true, {
                onSuccess() {
                  queryClient.invalidateQueries({ queryKey: [ticket_id] })
                  Linking.openURL(venmoLink)
                },
              })
            }
          >
            <Text>{status === 'open' ? '$' : payed ? '$' : 'X'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export function NonContributor({ username, ticketId }: { username: string; ticketId: TTicket['id'] }) {
  const queryClient = useQueryClient()
  const { mutate: join } = useMutation(getContributorMutation(ticketId))

  return (
    <View className=''>
      <Text>{username}</Text>
      <TouchableOpacity
        onPress={() =>
          join(undefined, {
            onSuccess() {
              queryClient.invalidateQueries({ queryKey: [ticketId] })
            },
          })
        }
      >
        <Text>X</Text>
      </TouchableOpacity>
    </View>
  )
}
