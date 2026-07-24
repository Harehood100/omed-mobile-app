import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import MenuRow from '../components/MenuRow'

export default function ProfileScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleBottom} />

            <ScrollView contentContainerStyle={styles.scroll}>
                <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />

                <View style={styles.menu}>
                    <MenuRow icon="👤" label="Edit Details" onPress={() => navigation.navigate('EditDetails')} />
                    <MenuRow icon="👨‍👩‍👧" label="Manage Caregiver / Child" onPress={() => navigation.navigate('ManageCaregiver')} />
                    <MenuRow icon="🔔" label="Notification Settings" onPress={() => navigation.navigate('NotificationSettings')} />
                    {/* Avatar Preference screen isn't built yet — wire this up once that screen exists. */}
                    <MenuRow icon="🐶" label="Avatar Preference" onPress={() => { }} />
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
