import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const RootLayout = () => {
  return (
    <Tabs screenOptions={{headerShown:false}}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="schedules" />
      <Tabs.Screen name="broadcast" />
      <Tabs.Screen name="notification" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )

}

export default RootLayout