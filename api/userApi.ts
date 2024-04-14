import supabase from '@/lib/supabase'
import { queryOptions } from '@tanstack/react-query'

export const getUserQuery = (id?: string) =>
  queryOptions({
    queryKey: ['user', id],
    async queryFn() {
      id ??= (await supabase.auth.getUser().then(({ data: { user } }) => user?.id)) ?? ''
      if (!id) return null
      return (await supabase.from('user').select('*').eq('id', id).single())?.data ?? null
    },
  })

export const getUserMutation = () => ({
  mutationKey: ['user'],
  async mutationFn({ username }: { username: string }) {
    await supabase.from('user').insert({ username })
  },
})
