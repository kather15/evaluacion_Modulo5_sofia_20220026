import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DrawerNavigator from './DraweNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [splashMinTimePassed, setSplashMinTimePassed] = useState(false);

  // Escuchar estado de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      setUser(userAuth);
      setFirebaseReady(true);
    });

    return unsubscribe;
  }, []);

  // Espera mínima para Splash (ej: 3 segundos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashMinTimePassed(true);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

  // Mostrar splash si Firebase o tiempo mínimo no han terminado
  if (!firebaseReady || !splashMinTimePassed) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={DrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;