import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, ActivityIndicator } from 'react-native'
import { AuthProvider, useAuth } from './context/AuthContext'
import CreateProfileScreen from './screens/CreateProfileScreen'
import ProfileScreen from './screens/ProfileScreen'
import EditDetailsScreen from './screens/EditDetailsScreen'
import ManageCaregiverScreen from './screens/ManageCaregiverScreen'
import NotificationSettingsScreen from './screens/NotificationSettingsScreen'
import LoginScreen from './screens/LoginScreen'
import WelcomeBackScreen from './screens/WelcomeBackScreen'
import HomeScreen from './screens/HomeScreen'
import AddCaregiverScreen from './screens/AddCaregiverScreen'
import GenerateCodeScreen from './screens/GenerateCodeScreen'
import EnterAccessCodeScreen from './screens/EnterAccessCodeScreen'
import AppointmentsScreen from './screens/AppointmentsScreen'
import SetReminderScreen from './screens/SetReminderScreen'
import ConfirmAppointmentScreen from './screens/ConfirmAppointmentScreen'

const Stack = createNativeStackNavigator()

function RootNavigator() {
  const { user, isLoading } = useAuth()

  // Wait until we've checked AsyncStorage for a saved token before deciding
  // where to start — otherwise we'd always flash CreateProfile first.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3D3F8F" />
      </View>
    )
  }

  return (
    <Stack.Navigator initialRouteName={user ? 'Home' : 'CreateProfile'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="WelcomeBack" component={WelcomeBackScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
      <Stack.Screen name="ManageCaregiver" component={ManageCaregiverScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="AddCaregiver" component={AddCaregiverScreen} />
      <Stack.Screen name="GenerateCode" component={GenerateCodeScreen} />
      <Stack.Screen name="EnterAccessCode" component={EnterAccessCodeScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="SetReminder" component={SetReminderScreen} />
      <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointmentScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
