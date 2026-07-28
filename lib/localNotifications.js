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

// date must be a JS Date in the future — scheduling a past date fires immediately on some
// platforms. `data` is delivered back with the notification when it fires — we use it to
// carry the backend reminderId so registerReminderTriggerListener can report the trigger.
export async function scheduleLocalNotification({ title, body, date, sound = true, data = {} }) {
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
        content: { title, body, sound, data },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    })
}

export async function cancelLocalNotification(identifier) {
    if (!identifier) return
    await Notifications.cancelScheduledNotificationAsync(identifier)
}

// Fires whenever a scheduled local notification is actually displayed. We use this to tell
// the backend the reminder fired (POST /reminders/{id}/trigger), matching the integration
// contract's "call this after the local notification has actually been displayed" note.
// Caveat: this only runs while the app process is alive (foreground or backgrounded-but-
// running) — Expo Go can't wake the app from fully killed to report a trigger, only a
// development build with proper background handling can do that.
export function registerReminderTriggerListener(onReminderTriggered) {
    return Notifications.addNotificationReceivedListener((notification) => {
        const reminderId = notification.request?.content?.data?.reminderId
        if (reminderId) {
            onReminderTriggered(reminderId)
        }
    })
}
