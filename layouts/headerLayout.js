import React from 'react'
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function HeaderLayout({option, navigation, headerStyle}) {

      return (
        <View style={[headerStyle, {height: option === 'Home' ? Platform.OS === 'android' ? 100 : 'ios' && 110 : 70}]} >
          {option === 'Home' ?
            <View style={styles.searchContainer}>
              <TextInput placeholder='Search Gumtree' style={styles.searchInput} />
              <Ionicons style={styles.searchIcon} name="search-outline" size={27} color="gray" />
            </View>
            :
            navigation.canGoBack() && <>
              <Ionicons name="chevron-back" size={24} color="white" onPress={() => navigation.goBack()} />
              <View style={styles.titleWrapper}><Text style={styles.title}>{option === 'Message' ? 'My Message' : option}</Text></View>
            </>
          }
        </View>
      )

}

const styles = StyleSheet.create({
    titleWrapper: {
      display: 'flex',
      flex: 1,
      paddingEnd: 25,
      alignItems:'center'
    },
  
    title: {
      fontSize: 18,
      color: 'white',
    },
    
    searchInput: {
      fontSize: 18,
      backgroundColor: 'white',
      width: `${100}%`,
      height: `${50}%`,
      color: 'black',
      padding: 10,
      paddingLeft: 45,
      borderRadius: 5,
      position: 'absolute',
      top: -15
    },
    searchContainer: {
      position: 'relative',
      width: `${100}%`
    },
    searchIcon: {
      position: 'absolute',
      bottom: `${-25}%`,
      left: 10
    }
  })
