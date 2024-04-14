import { getUserMutation, getUserQuery } from '@/api/userApi'
import supabase from '@/lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Tabs } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, Button, SafeAreaView, TextInput } from 'react-native'

export default function _layout() {
  const queryClient = useQueryClient()
  const { data: user } = useQuery(getUserQuery())
  const { mutate: createUser, isPending } = useMutation(getUserMutation())

  const onSave = async () => {
    if (!username) return Alert.alert('Name is required')
    createUser({ username }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getUserQuery().queryKey }), onError: err => Alert.alert(err.message) })
  }

  const [username, setUsername] = useState('')

  if (!user)
    return (
      <SafeAreaView>
        <TextInput value={username} onChangeText={(text: string) => setUsername(text)} className='border border-black p-2 m-2' />
        <Button disabled={isPending} title='Save' onPress={onSave} />
      </SafeAreaView>
    )
  return (
    <Tabs>
      <Tabs.Screen name='index' options={{ title: 'Home', headerRight: () => <Button title='Sign Out' onPress={() => supabase.auth.signOut()} /> }} />
    </Tabs>
  )
}
