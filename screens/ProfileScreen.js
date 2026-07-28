import { View, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import MenuRow from '../components/MenuRow'
import { useAuth } from '../context/AuthContext'

export default function ProfileScreen({ navigation }) {
    const { logout, lastKnownUser } = useAuth()

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    await logout()
                    navigation.reset({ index: 0, routes: [{ name: lastKnownUser ? 'WelcomeBack' : 'Welcome' }] })
                },
            },
        ])
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleBottom} />

            <ScrollView contentContainerStyle={styles.scroll}>
                <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />

                <View style={styles.menu}>
                    <MenuRow icon="👤" label="Edit Details" onPress={() => navigation.navigate('EditDetails')} />
                    <MenuRow icon="👨‍👩‍👧" label="Manage Caregiver / Child" onPress={() => navigation.navigate('ManageCaregiver')} />
                    <MenuRow icon="🔔" label="Notification Settings" onPress={() => navigation.navigate('NotificationSettings')} />
                    <MenuRow icon="🐶" label="Avatar Preference" onPress={() => navigation.navigate('AvatarPreference')} />
                    <MenuRow icon="🚪" label="Log Out" onPress={handleLogout} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleBottom: { position: 'absolute', bottom: -220, left: -40, width: 460, height: 460, borderRadius: 230, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { paddingBottom: 60, zIndex: 1 },
    menu: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
})
