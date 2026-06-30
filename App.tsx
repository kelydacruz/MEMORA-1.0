import React from 'react';
import { Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import Login from './Screens/Login';
import Register from './Screens/Register';
import Home from './Screens/Home';
import NovaMemoria from './Screens/NovaMemoria';
import DetalheMemoria from './Screens/DetalheMemoria';
import Perfil from './Screens/Perfil';
import Sobre from './Screens/Sobre';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  NovaMemoria: undefined;
  DetalheMemoria: { memoriaId: string };
  Perfil: undefined;
  Sobre: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: focused ? 24 : 21,
        opacity: focused ? 1 : 0.65,
      }}
    >
      {emoji}
    </Text>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5F7F5C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#F7F1E8',
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home as any}
        options={{
          title: 'Memora',
          headerBackVisible: false,
        }}
      />

      <HomeStack.Screen
        name="NovaMemoria"
        component={NovaMemoria as any}
        options={{
          title: 'Nova memória',
        }}
      />

      <HomeStack.Screen
        name="DetalheMemoria"
        component={DetalheMemoria as any}
        options={{
          title: 'Detalhes da memória',
        }}
      />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#5F7F5C',
        tabBarInactiveTintColor: '#9C958B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 6,
          backgroundColor: '#FFFDF8',
          borderTopWidth: 1,
          borderTopColor: '#E5D9CA',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -3 },
          elevation: 12,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeStackNavigator}
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil as any}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Sobre"
        component={Sobre as any}
        options={{
          title: 'Sobre',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon emoji="ℹ️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />

      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#F7F1E8',
          },
        }}
      >
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Register" component={Register as any} />
        <RootStack.Screen name="Home" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
