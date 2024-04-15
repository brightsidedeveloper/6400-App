import supabase from '@/lib/supabase'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

const CommentSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  ticket_id: z.string(),
  text: z.string(),
  created_at: z.string(),
})

export type Comment = z.infer<typeof CommentSchema>

export const getCommentQuery = (ticket_id: string) =>
  queryOptions({
    queryKey: ['comment', ticket_id],
    async queryFn() {
      const { data, error } = await supabase.from('comment').select('*').eq('ticket_id', ticket_id)
      if (error) throw new Error(error.message)
      return data as Comment[]
    },
  })
