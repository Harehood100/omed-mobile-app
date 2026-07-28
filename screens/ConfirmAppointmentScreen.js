import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native'
import { createAppointment } from '../api/appointments'
import { scheduleLocalNotification } from '../lib/localNotifications'
import { toHHMM } from '../lib/medicationTime'

// Backend "errors" fields have shown up in more than one shape (arrays of
// strings, nested objects, plain strings) — this walks whatever comes back
// and always produces readable text instead of "[object Object]".
function extractErrorMessage(err) {
    const parts = []

    const collect = (value) => {
        if (value == null) return
        if (typeof value === 'string') { parts.push(value); return }
        if (Array.isArray(value)) { value.forEach(collect); return }
        if (typeof value === 'object') { Object.values(value).forEach(collect); return }
        parts.push(String(value))
    }

    if (err?.errors) collect(err.errors)
    if (parts.length === 0 && err?.message) parts.push(err.message)
    if (parts.length === 0) parts.push('Please try again.')

    return parts.join(' ')
}

function formatDateLabel(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// Backend expects "YYYY-MM-DD".
function toDateOnly(iso) {
    return new Date(iso).toISOString().slice(0, 10)
}

// Backend expects 24-hour "HH:mm" — the display label ("9:30 AM") is for humans only.
function toApiTime(iso) {
    const d = new Date(iso)
    return toHHMM({ hours: d.getHours(), minutes: d.getMinutes() })
}

function Row({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}:</Text>
            <Text style={styles.rowValue}>{value || '—'}</Text>
        </View>
    )
}

export default function ConfirmAppointmentScreen({ navigation, route }) {
    const { date, time, hospitalName, doctorName, doctorSpeciality, notes, minutesBefore } = route?.params || {}
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await createAppointment({
                hospitalName,
                doctorSpeciality,
                doctorName,
                appointmentDate: toDateOnly(date),
                appointmentTime: toApiTime(date),
                note: notes,
            })

            // Reminders are scheduled on-device for this MVP (no backend reminder
            // endpoint yet, per the integration contract's "Reminder Integration" section).
            if (minutesBefore) {
                const triggerDate = new Date(new Date(date).getTime() - minutesBefore * 60 * 1000)
                await scheduleLocalNotification({
                    title: 'Appointment Reminder',
                    body: `${doctorName || 'Your doctor'} appointment${hospitalName ? ` at ${hospitalName}` : ''} soon.`,
                    date: triggerDate,
                })
            }

            // AppointmentsScreen watches for this param and refetches from the server
            // rather than trusting local state.
            navigation.navigate('Appointments', { appointmentCreated: true })
        } catch (err) {
            console.log('createAppointment failed:', JSON.stringify(err))
            const detail = extractErrorMessage(err)
            Alert.alert('Could not save appointment', detail)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Confirm Appointment</Text>
            </View>

            <View style={styles.form}>
                <Row label="Hospital" value={hospitalName} />
                <Row label="Doctor" value={doctorName} />
                <Row label="Speciality" value={doctorSpeciality} />
                <Row label="Date" value={formatDateLabel(date)} />
                <Row label="Time" value={time} />
                <Row label="Notes" value={notes} />
                <Row label="Reminder" value={minutesBefore ? `${minutesBefore} minutes before` : 'None'} />
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveBtnText}>Save Appointment</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, gap: 16 },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    form: { paddingHorizontal: 24, paddingTop: 28, gap: 18 },
    row: { flexDirection: 'row', gap: 8 },
    rowLabel: { fontSize: 16, fontWeight: 'bold', color: '#3D3F8F' },
    rowValue: { fontSize: 16, color: '#3D3F8F', flexShrink: 1 },
    bottom: { paddingHorizontal: 24, paddingTop: 40 },
    saveBtn: { width: '100%', height: 56, backgroundColor: '#2D3178', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
})
