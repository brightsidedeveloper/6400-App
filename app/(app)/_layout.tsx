import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='(tabs)' />
      <Stack.Screen
        name='create'
        options={{
          headerShown: true,
          title: 'Create',
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
