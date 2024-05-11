import * as React from 'react'
import { Platform, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { resetForm } from '../features/resetFormContext';
import SearchComponent from '../components/searchComponent';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export default function HeaderLayout({option, navigation, headerStyle}) {
    const{setResetData} = React.useContext(resetForm)
    // React.useEffect(() => console.log("stacked route", stackRoute), [])
      return (
        <View style={[headerStyle, {height: option === 'Home' ? Platform.OS === 'android' ? StatusBar.currentHeight + 100 : 'ios' && StatusBar.currentHeight + 110 : StatusBar.currentHeight + 70}]} >
          {option === 'Home' ?
              <SearchComponent navigation={navigation} />
            :
            option === 'Post' ? 
              <>
                <Text style={styles.title} onPress={() => (setResetData(true), navigation.navigate('Home'))}>Cancel</Text>
                <View style={[styles.titleWrapper, {paddingEnd: 50}]}><Text style={styles.title}>{option === 'Message' ? 'My Message' : option}</Text></View>
                </>
              :
            
            navigation.canGoBack() && <>
              <Ionicons name="chevron-back" size={24} color="white" onPress={() => navigation.goBack()} />
              <View style={styles.titleWrapper}><Text style={styles.title}>{option}</Text></View>
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
  })
