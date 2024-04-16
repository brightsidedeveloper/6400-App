import supabase from '@/lib/supabase'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

const ContributorSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  ticket_id: z.string(),
  created_at: z.string(),
  payed: z.boolean(),
})

export type TContributor = z.infer<typeof ContributorSchema>

export const getContributorQuery = (ticket_id: string) =>
  queryOptions({
    queryKey: ['contributor', ticket_id],
    async queryFn() {
      const { data, error } = await supabase.from('contributor').select('*').eq('ticket_id', ticket_id)
      if (error) throw new Error(error.message)
      return data as TContributor[]
    },
  })

export const getContributorMutation = (ticket_id: string) => ({
  mutationKey: ['contributor', ticket_id],
  async mutationFn(pay?: boolean) {
    if (pay) await supabase.from('contributor').upsert({ ticket_id, payed: true })
    await supabase.from('contributor').upsert({ ticket_id })
  },
})
