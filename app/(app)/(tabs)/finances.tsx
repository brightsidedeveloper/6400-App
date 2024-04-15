import { View, Text, FlatList } from "react-native"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getTicketQuery } from "@/api/ticketApi"
import Ticket from "@/features/finances/components/Ticket"

export default function finances() {
  const { data: tickets } = useQuery(getTicketQuery({ type: "finance" }))
  return (
    <View>
      <FlatList
        data={tickets}
        renderItem={({ item: ticket }) => <Ticket {...ticket} />}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={() => <Text>No Tickets</Text>}
      />
    </View>
  )
}
