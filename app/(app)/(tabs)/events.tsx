import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTicketQuery } from '@/api/ticketApi'
import Ticket from '@/features/tickets/Ticket'

export default function events() {
  const { data: tickets } = useQuery(getTicketQuery({ type: 'event' }))
  return (
    <View className='flex-1'>
      <FlatList data={tickets} renderItem={({ item: ticket }) => <Ticket {...ticket} />} keyExtractor={({ id }) => id} ListEmptyComponent={() => <Text>No Tickets</Text>} />
    </View>
  )
}
