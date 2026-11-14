import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../components/Header';
import { colors } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import WeakTopicsScreen from '../screens/WeakTopicsScreen';
import PlannerScreen from '../screens/PlannerScreen';
import ProgressScreen from '../screens/ProgressScreen';
import PaperDetailsScreen from '../screens/PaperDetailsScreen';
import AddEditAttemptScreen from '../screens/AddEditAttemptScreen';
import TopicDetailsScreen from '../screens/TopicDetailsScreen';
import SubjectOverviewScreen from '../screens/SubjectOverviewScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  Library: ['library', 'library-outline'],
  WeakTopics: ['warning', 'warning-outline'],
  Planner: ['calendar', 'calendar-outline'],
  Progress: ['trending-up', 'trending-up-outline'],
};

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation, options }) => (
          <Header navigation={navigation} title={options.title} isHome={route.name === 'Home'} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1.5,
          borderTopColor: colors.border,
          height: 58 + (Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 6)),
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 6),
        },
        tabBarIcon: ({ focused, color, size }) => {
          const [filled, outline] = TAB_ICONS[route.name];
          return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Paper Library', tabBarLabel: 'Library' }} />
      <Tab.Screen
        name="WeakTopics"
        component={WeakTopicsScreen}
        options={{ title: 'Weak Topics', tabBarLabel: 'Weak Topics' }}
      />
      <Tab.Screen name="Planner" component={PlannerScreen} options={{ title: 'Revision Planner', tabBarLabel: 'Planner' }} />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'Progress & History', tabBarLabel: 'Progress' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          header: ({ navigation, options }) => (
            <Header
              navigation={navigation}
              title={options.title}
              showBack
              showLog={route.name !== 'AddAttempt' && route.name !== 'Settings'}
              showProfile={route.name !== 'Settings'}
            />
          ),
        })}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="PaperDetails" component={PaperDetailsScreen} options={{ title: 'Paper Details' }} />
        <Stack.Screen
          name="AddAttempt"
          component={AddEditAttemptScreen}
          options={{ title: 'Log Attempt', presentation: 'modal' }}
        />
        <Stack.Screen name="TopicDetails" component={TopicDetailsScreen} options={{ title: 'Topic Details' }} />
        <Stack.Screen name="SubjectOverview" component={SubjectOverviewScreen} options={{ title: 'Subject Overview' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings & About' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
