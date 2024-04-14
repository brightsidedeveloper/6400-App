import supabase from "@/lib/supabase"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

const TicketSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  contributors: z.array(z.string()),
  status: z.string(),
  created_at: z.string(),
  date: z.string(),
  type: z.string(),
  amount: z.number().optional(),
})

export type Ticket = z.infer<typeof TicketSchema>

export type TicketQueryProps = { id?: string; user_id?: string }

export const getTicketQuery = ({ id, user_id }: TicketQueryProps = {}) =>
  queryOptions({
    queryKey: ["ticket", id, user_id],
    async queryFn() {
      let request
      if (id)
        request = supabase.from("ticket").select("*").eq("id", id).single()
      else if (user_id)
        request = supabase.from("ticket").select("*").eq("user_id", user_id)
      request = supabase.from("ticket").select("*")
      const { data, error } = await request
      if (error) throw new Error(error.message)
      return data
    },
  })

export const getTicketMutation = () => ({
  mutationKey: ["ticket"],
  async mutationFn(tickets: Partial<Ticket>[]) {
    return supabase.from("ticket").insert(tickets)
  },
})
