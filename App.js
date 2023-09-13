import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import TabLayout from './layouts/tabLayout';

export default function App() {
  return (<>
    <NavigationContainer>
      <TabLayout />
    </NavigationContainer>
    </>
  )
}
