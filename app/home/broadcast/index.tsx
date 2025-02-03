import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Broadcast = () => {
  return (
    <View>
      <Text>Broadcasting page</Text>
      <Link href="/home/explore/routine" style={{textAlign:"center", fontSize:20}} >Routine</Link>
    </View>
  )
}

export default Broadcast