import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Start = () => {
  return (
    <View>
      <Text>Starting Page</Text>
      <Link style={{textAlign:"center", fontSize:20}} href="/home">Home</Link>
    </View>
  )
}

export default Start