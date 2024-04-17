import { TContributor, getContributorMutation, getContributorQuery } from '@/api/contributorApi'
import { TTicket, ticketTypes } from '@/api/ticketApi'
import { User, getAllUsersQuery, getUserQuery } from '@/api/userApi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { Button } from 'react-native-elements'
import Contributor, { NonContributor } from './Contributor'

export default function Ticket({ id, title, description, user_id, status, type, full, join_date, pay_date, amount }: TTicket & { full?: boolean }) {
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
      <TicketTop username={user?.username ?? 'Unknown'} title={title} description={description} type={type} full={full} />
      {full && <TicketTime join_date={join_date} pay_date={pay_date} />}
      {full && <TicketContributors contributors={contributors} status={status} nonContributors={nonContributors} ticket_id={id} />}
      {amount && <TicketPay amount={amount} contributors={contributors} full={full} />}
    </TouchableOpacity>
  )
}

interface TicketTopProps {
  username: User['username']
  title: TTicket['title']
  description: TTicket['description']
  type: TTicket['type']
  full: boolean
}

function TicketTop({ username, title, description, type, full }: TicketTopProps) {
  return (
    <>
      <View className='flex-row justify-between'>
        <View className='flex-row gap-1'>
          <Text>Creator: {username}</Text>
          <Text>{title}</Text>
        </View>
        <View className='flex-col items-end gap-1'>
          <Text className='bg-red-500 text-white rounded-full p-1'>{status}</Text>
          <Text>{ticketTypes.find(({ value }) => value === type)?.label ?? 'Unknown'}</Text>
        </View>
      </View>
      {description && <Text>{full ? description : description.slice(0, 32)}</Text>}
    </>
  )
}

interface TicketTimeProps {
  join_date: TTicket['join_date']
  pay_date: TTicket['pay_date']
}

function TicketTime({ join_date, pay_date }: TicketTimeProps) {
  return (
    <View className='flex-row justify-between'>
      <Text>Join Date: {join_date}</Text>
      <Text>Pay Date: {pay_date}</Text>
    </View>
  )
}

interface TicketContributorsProps {
  contributors?: TContributor[]
  status: TTicket['status']
  nonContributors: User[]
  ticket_id: TTicket['id']
}

function TicketContributors({ contributors, status, nonContributors, ticket_id }: TicketContributorsProps) {
  return (
    <>
      {contributors &&
        contributors.map(contributor => (
          <Contributor
            key={contributor.id}
            {...contributor}
            status={status}
            venmoLink={`https://venmo.com/${user.venmo}?txn=pay&note=${title}&amount=${amount / (contributors ? contributors.length + 1 : 1)}`}
          />
        ))}
      {nonContributors && status === 'open' && nonContributors.map(user => <NonContributor key={user.id} {...user} ticketId={ticket_id} />)}
    </>
  )
}

interface TicketPayProps {
  amount: number
  contributors?: any[]
  full: boolean
}

function TicketPay({ amount, contributors, full }: TicketPayProps) {
  return (
    <>
      <View className=''>
        <Text>Total: {amount}</Text>
        {full && <Text>Current Each: {amount / (contributors ? contributors.length + 1 : 1)}</Text>}
      </View>
    </>
  )
}
