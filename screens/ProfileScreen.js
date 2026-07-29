import { useEffect, useState } from 'react'
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as BackgroundTask from 'expo-background-task'
import ScreenHeader from '../components/ScreenHeader'
import MenuRow from '../components/MenuRow'
import { useAuth } from '../context/AuthContext'
import { REMINDER_SYNC_TASK } from '../lib/reminderBackgroundTask'

const STATUS_LABELS = {
    [BackgroundTask.BackgroundTaskStatus.Available]: 'Available',
    [BackgroundTask.BackgroundTaskStatus.Restricted]: 'Restricted',
}

export default function ProfileScreen({ navigation }) {
    const { logout, lastKnownUser } = useAuth()
    const [taskStatus, setTaskStatus] = useState(null)
    const [isRunningTask, setIsRunningTask] = useState(false)

    // Dev-only: lets you check the background task's availability without waiting for a
    // real 15+ minute interval to roll around. Not shown in production builds (__DEV__).
    useEffect(() => {
        if (!__DEV__) return
        BackgroundTask.getStatusAsync().then(setTaskStatus).catch(() => {})
    }, [])

    const handleRunSyncNow = async () => {
        setIsRunningTask(true)
        try {
            await BackgroundTask.triggerTaskWorkerForTestingAsync()
            Alert.alert(
                'Sync triggered',
                'The reminder sync task ran — check your Metro logs or the backend for any reminders that just flipped to TRIGGERED.'
            )
        } catch (err) {
            console.log('triggerTaskWorkerForTestingAsync failed:', JSON.stringify(err))
            Alert.alert('Could not trigger sync', 'This only works in a development build, not Expo Go or a production build.')
        } finally {
            setIsRunningTask(false)
        }
    }

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

                {__DEV__ && (
                    <View style={styles.debugPanel}>
                        <Text style={styles.debugTitle}>Debug: Reminder Background Sync</Text>
                        <Text style={styles.debugRow}>
                            Task: <Text style={styles.debugMono}>{REMINDER_SYNC_TASK}</Text>
                        </Text>
                        <Text style={styles.debugRow}>
                            Status: <Text style={styles.debugMono}>{taskStatus ? STATUS_LABELS[taskStatus] ?? taskStatus : 'checking...'}</Text>
                        </Text>
                        <TouchableOpacity style={styles.debugBtn} onPress={handleRunSyncNow} disabled={isRunningTask}>
                            {isRunningTask ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.debugBtnText}>Run Sync Now</Text>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.debugHint}>
                            Only works in a development build — Expo Go and production builds will show an error here.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleBottom: { position: 'absolute', bottom: -220, left: -40, width: 460, height: 460, borderRadius: 230, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { paddingBottom: 60, zIndex: 1 },
    menu: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
    debugPanel: { marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: '#3D3F8F', borderStyle: 'dashed', gap: 8, zIndex: 1 },
    debugTitle: { fontSize: 14, fontWeight: '700', color: '#3D3F8F' },
    debugRow: { fontSize: 13, color: '#1A1A1A' },
    debugMono: { fontWeight: '600' },
    debugBtn: { backgroundColor: '#3D3F8F', borderRadius: 20, paddingVertical: 10, alignItems: 'center', marginTop: 6 },
    debugBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    debugHint: { fontSize: 11, color: '#8285B0' },
})
