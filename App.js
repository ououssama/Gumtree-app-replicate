import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import TabLayout from './layouts/tabLayout';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './features/redux/reducers'

const store = configureStore({
  reducer: rootReducer
})

export default function App() {
  return (<>
    <NavigationContainer>
      <Provider store={store}>
        <TabLayout />
      </Provider>
    </NavigationContainer>
    </>
  )
}
