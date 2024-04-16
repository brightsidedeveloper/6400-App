import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getTicketQuery } from '@/api/ticketApi'
import Ticket from '@/features/tickets/Ticket'

export default function ViewTicket() {
  const params = useLocalSearchParams()
  const id = typeof params.ticket === 'string' ? params.ticket : params.ticket[0] ?? ''
  const { data: ticket } = useQuery(getTicketQuery({ id }))
  console.log(ticket, id)
  if (!ticket)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  return <Ticket full {...ticket[0]} />
}
