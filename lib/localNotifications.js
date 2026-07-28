import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
})

export async function ensureNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    if (existingStatus === 'granted') return true

    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
}

// date must be a JS Date in the future — scheduling a past date fires immediately on some platforms.
export async function scheduleLocalNotification({ title, body, date, sound = true }) {
    const granted = await ensureNotificationPermissions()
    if (!granted) return null

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
        })
    }

    if (date.getTime() <= Date.now()) return null

    return Notifications.scheduleNotificationAsync({
        content: { title, body, sound },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    })
}

export async function cancelLocalNotification(identifier) {
    if (!identifier) return
    await Notifications.cancelScheduledNotificationAsync(identifier)
}
