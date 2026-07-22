import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider } from './context/AuthContext'
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

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CreateProfile" screenOptions={{ headerShown: false }}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}
