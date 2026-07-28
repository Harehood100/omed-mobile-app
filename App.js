import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import { registerReminderTriggerListener } from './lib/localNotifications'
import { triggerReminder } from './api/reminders'
import SplashScreen from './screens/SplashScreen'
import WelcomeScreen from './screens/WelcomeScreen'
import CreateProfileScreen from './screens/CreateProfileScreen'
import LoginScreen from './screens/LoginScreen'
import WelcomeBackScreen from './screens/WelcomeBackScreen'
import HomeScreen from './screens/HomeScreen'
import AddCaregiverScreen from './screens/AddCaregiverScreen'
import GenerateCodeScreen from './screens/GenerateCodeScreen'
import EnterAccessCodeScreen from './screens/EnterAccessCodeScreen'
import AppointmentsScreen from './screens/AppointmentsScreen'
import SetReminderScreen from './screens/SetReminderScreen'
import ConfirmAppointmentScreen from './screens/ConfirmAppointmentScreen'
import InputMedicationsScreen from './screens/InputMedicationsScreen'
import MedicationsScreen from './screens/MedicationsScreen'
import MedicationReminderScreen from './screens/MedicationReminderScreen'
import ProfileScreen from './screens/ProfileScreen'
import EditDetailsScreen from './screens/EditDetailsScreen'
import ManageCaregiverScreen from './screens/ManageCaregiverScreen'
import NotificationSettingsScreen from './screens/NotificationSettingsScreen'
import SoundSettingsScreen from './screens/SoundSettingsScreen'
import VibrationSettingsScreen from './screens/VibrationSettingsScreen'
import AvatarPreferenceScreen from './screens/AvatarPreferenceScreen'

const Stack = createNativeStackNavigator()

function RootNavigator() {
  // Splash plays the animation first and internally waits for the session
  // check (AuthContext's isLoading) before deciding whether to route to
  // Welcome or Home — so no separate loading gate is needed here.
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="WelcomeBack" component={WelcomeBackScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddCaregiver" component={AddCaregiverScreen} />
      <Stack.Screen name="GenerateCode" component={GenerateCodeScreen} />
      <Stack.Screen name="EnterAccessCode" component={EnterAccessCodeScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="SetReminder" component={SetReminderScreen} />
      <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointmentScreen} />
      <Stack.Screen name="InputMedications" component={InputMedicationsScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="MedicationReminder" component={MedicationReminderScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditDetails" component={EditDetailsScreen} />
      <Stack.Screen name="ManageCaregiver" component={ManageCaregiverScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="SoundSettings" component={SoundSettingsScreen} />
      <Stack.Screen name="VibrationSettings" component={VibrationSettingsScreen} />
      <Stack.Screen name="AvatarPreference" component={AvatarPreferenceScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  // Whenever a scheduled local notification actually displays, tell the backend so it
  // can flip the reminder from PENDING to TRIGGERED (see lib/localNotifications.js).
  useEffect(() => {
    const subscription = registerReminderTriggerListener((reminderId) => {
      triggerReminder(reminderId).catch((err) => {
        console.log('triggerReminder failed:', JSON.stringify(err))
      })
    })
    return () => subscription.remove()
  }, [])

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

