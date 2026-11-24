import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../config/constants';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import JobsScreen from '../screens/applicant/JobsScreen';
import MyApplicationsScreen from '../screens/applicant/MyApplicationsScreen';
import ProfileScreen from '../screens/applicant/ProfileScreen';

import HirerDashboardScreen from '../screens/hirer/HirerDashboardScreen';
import CandidatesScreen from '../screens/hirer/CandidatesScreen';
import CandidateDetailScreen from '../screens/hirer/CandidateDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack for guests
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Applicant Bottom Tabs
const ApplicantTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      headerStyle: { backgroundColor: '#FFFFFF' },
      headerTitleStyle: { fontWeight: '800', fontSize: 16, color: COLORS.text },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: COLORS.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarIcon: ({ color, size }) => {
        let iconName = 'briefcase';
        if (route.name === 'Available Shifts') iconName = 'restaurant';
        else if (route.name === 'My Shifts') iconName = 'time';
        else if (route.name === 'Profile') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Available Shifts" component={JobsScreen} />
    <Tab.Screen name="My Shifts" component={MyApplicationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Hirer Stack (Dashboard, Candidates, CandidateDetail)
const HirerStack = createNativeStackNavigator();
const HirerStackNavigator = () => (
  <HirerStack.Navigator>
    <HirerStack.Screen
      name="Dashboard"
      component={HirerDashboardScreen}
      options={{ title: 'Recruiter Dashboard' }}
    />
    <HirerStack.Screen
      name="Candidates"
      component={CandidatesScreen}
      options={{ title: 'Applicant Pool' }}
    />
    <HirerStack.Screen
      name="CandidateDetail"
      component={CandidateDetailScreen}
      options={{ title: 'Candidate Profile' }}
    />
  </HirerStack.Navigator>
);

// Hirer Bottom Tabs
const HirerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: COLORS.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarIcon: ({ color, size }) => {
        let iconName = 'stats-chart';
        if (route.name === 'Recruitment') iconName = 'bar-chart';
        else if (route.name === 'Settings') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Recruitment" component={HirerStackNavigator} />
    <Tab.Screen name="Settings" component={ProfileScreen} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'hirer' ? (
        <HirerTabs />
      ) : (
        <ApplicantTabs />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
