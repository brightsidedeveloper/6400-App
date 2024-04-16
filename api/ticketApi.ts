import supabase from '@/lib/supabase'
import { queryOptions } from '@tanstack/react-query'
import { literal, z } from 'zod'

const TicketSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.union([literal('open'), literal('pending'), literal('closed')]),
  created_at: z.string(),
  join_date: z.string(),
  pay_date: z.string(),
  type: z.string(),
  amount: z.number().optional(),
})

export type TTicket = z.infer<typeof TicketSchema>

export type TicketQueryProps = {
  id?: string
  user_id?: string
  type?: 'finance' | 'event' | 'chore'
}

export const getTicketQuery = ({ id, user_id, type }: TicketQueryProps = {}) =>
  queryOptions({
    queryKey: ['ticket', id, user_id, type],
    async queryFn() {
      let request
      if (id) request = supabase.from('ticket').select('*').eq('id', id)
      else if (user_id) request = supabase.from('ticket').select('*').eq('user_id', user_id)
      else if (type) request = supabase.from('ticket').select('*').eq('type', type)
      else request = supabase.from('ticket').select('*')
      const { data, error } = await request
      if (error) throw new Error(error.message)
      return data as TTicket[]
    },
  })

export const getTicketMutation = () => ({
  mutationKey: ['ticket'],
  async mutationFn(ticket: Partial<TTicket>) {
    const { data, error } = await supabase.from('ticket').insert([ticket])
    if (error) throw new Error(error.message)
    return data
  },
})

export const ticketTypes = [
  { value: 'finance', label: 'Pitch In' },
  { value: 'event', label: 'Event' },
  { value: 'chore', label: 'Chore' },
]
