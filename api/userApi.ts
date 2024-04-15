import supabase from "@/lib/supabase"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  venmo: z.string(),
})

export type User = z.infer<typeof UserSchema>

export const getUserQuery = (id?: string) =>
  queryOptions({
    queryKey: ["user", id],
    async queryFn() {
      id ??=
        (await supabase.auth
          .getUser()
          .then(({ data: { user } }) => user?.id)) ?? ""
      if (!id) return null
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw new Error(error.message)
      return data as User | null
    },
  })

export type UpdateUserMutationProps = { username?: string; venmo?: string }

export const getUserMutation = () => ({
  mutationKey: ["user"],
  async mutationFn({ username, venmo }: UpdateUserMutationProps) {
    await supabase.from("user").upsert({ username, venmo })
  },
})
