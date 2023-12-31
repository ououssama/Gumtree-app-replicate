import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import TabLayout from './layouts/tabLayout';
import { Provider } from 'react-redux';
import { persistor, store } from './features/redux/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from './components/loadingScreen';

// console.log(store.getState())

export default function App() {
  return (<>
    <NavigationContainer>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <Provider store={store}>
          <TabLayout />
        </Provider>
      </PersistGate>
    </NavigationContainer>
    </>
  )
}
