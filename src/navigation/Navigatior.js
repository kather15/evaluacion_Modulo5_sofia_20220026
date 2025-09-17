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

  
  useEffect(() => {
    console.log('Configurando listener de autenticación...');
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      console.log('Estado de auth cambió:', userAuth ? 'Usuario logueado' : 'No hay usuario');
      setUser(userAuth);
      setFirebaseReady(true);
    });

    return unsubscribe;
  }, []);

 
  useEffect(() => {
    console.log('Iniciando timer del splash...');
    const timer = setTimeout(() => {
      console.log('Tiempo mínimo de splash completado');
      setSplashMinTimePassed(true);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, []);

 
  if (!firebaseReady || !splashMinTimePassed) {
    console.log('Mostrando splash screen...', { firebaseReady, splashMinTimePassed });
    return <SplashScreen />;
  }

  console.log('Navegando a:', user ? 'App principal' : 'Login/Register');

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