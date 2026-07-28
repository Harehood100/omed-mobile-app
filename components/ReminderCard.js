import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { formatReminderTime } from '../lib/medicationTime'

const ACTIONABLE_STATUSES = ['PENDING', 'TRIGGERED']

const STATUS_COLORS = {
    PENDING: '#9B9ECC',
    TRIGGERED: '#E8A33D',
    TAKEN: '#3FA34D',
    SKIPPED: '#B0B0B0',
    MISSED: '#D64545',
    CANCELLED: '#B0B0B0',
}

const PRIMARY = '#3D3F8F'

export default function ReminderCard({ reminder, onTaken, onSkipped, busy }) {
    const status = reminder.status || 'PENDING'
    const canAct = ACTIONABLE_STATUSES.includes(status)

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.title} numberOfLines={1}>{reminder.title}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] || '#9B9ECC' }]}>
                    <Text style={styles.badgeText}>{status}</Text>
                </View>
            </View>

            {reminder.message ? <Text style={styles.message} numberOfLines={2}>{reminder.message}</Text> : null}
            <Text style={styles.time}>{formatReminderTime(reminder.scheduledAt)}</Text>

            {canAct && (
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionBtn, styles.takenBtn]} onPress={() => onTaken(reminder)} disabled={busy}>
                        <Text style={styles.takenBtnText}>Taken</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.skipBtn]} onPress={() => onSkipped(reminder)} disabled={busy}>
                        <Text style={styles.skipBtnText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 6, borderWidth: 1, borderColor: '#E4E4F2' },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    title: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', flexShrink: 1 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    message: { fontSize: 13, color: '#5A5C8C' },
    time: { fontSize: 13, fontWeight: '600', color: PRIMARY },
    actions: { flexDirection: 'row', gap: 10, marginTop: 6 },
    actionBtn: { flex: 1, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    takenBtn: { backgroundColor: '#2D3178' },
    takenBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    skipBtn: { borderWidth: 1.5, borderColor: PRIMARY },
    skipBtnText: { color: PRIMARY, fontSize: 13, fontWeight: '700' },
})
