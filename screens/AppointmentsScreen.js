import { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// npm install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker'
import { getAppointments } from '../api/appointments'

function initials(name) {
    if (!name) return '?'
    return name
        .replace('Dr.', '')
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
}

function formatDateLabel(dateStr, timeStr) {
    if (!dateStr) return timeStr || ''
    const label = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    return timeStr ? `${label} . ${timeStr}` : label
}

function AppointmentCard({ appointment }) {
    return (
        <View style={styles.card}>
            {appointment.status ? (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{appointment.status}</Text>
                </View>
            ) : null}
            <View style={styles.cardRow}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(appointment.doctorName)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    <Text style={styles.specialty}>{appointment.doctorSpecialty}</Text>
                    <Text style={styles.dateLabel}>{formatDateLabel(appointment.appointmentDate, appointment.appointmentTime)}</Text>
                    {appointment.hospitalName ? <Text style={styles.hospital}>{appointment.hospitalName}</Text> : null}
                </View>
            </View>
        </View>
    )
}

export default function AppointmentsScreen({ navigation, route }) {
    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [loadError, setLoadError] = useState(null)
    const [pickerStep, setPickerStep] = useState(null) // null | 'date' | 'time'
    const [pickedDate, setPickedDate] = useState(new Date())

    const loadAppointments = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setIsLoading(true)
        setLoadError(null)
        try {
            const data = await getAppointments()
            setAppointments(Array.isArray(data) ? data : data?.appointments || [])
        } catch (err) {
            setLoadError(err.message || 'Could not load appointments.')
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])

    useEffect(() => {
        loadAppointments()
    }, [loadAppointments])

    // A newly-created appointment comes back from ConfirmAppointmentScreen — refetch
    // to stay in sync with the server rather than trusting local state alone.
    useEffect(() => {
        if (route?.params?.appointmentCreated) {
            navigation.setParams({ appointmentCreated: undefined })
            loadAppointments({ silent: true })
        }
    }, [route?.params?.appointmentCreated, loadAppointments, navigation])

    const startCreateAppointment = () => {
        setPickedDate(new Date())
        setPickerStep('date')
    }

    const handlePickerChange = (event, selected) => {
        if (Platform.OS === 'android') setPickerStep(null)
        if (!selected) return

        if (pickerStep === 'date') {
            setPickedDate(selected)
            setPickerStep('time')
        } else if (pickerStep === 'time') {
            const combined = new Date(pickedDate)
            combined.setHours(selected.getHours(), selected.getMinutes())
            setPickerStep(null)
            const timeLabel = combined.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            navigation.navigate('SetReminder', { date: combined.toISOString(), time: timeLabel })
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); loadAppointments({ silent: true }) }} />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Appointments</Text>
                </View>

                <View style={styles.introCard}>
                    <Text style={styles.introText}>Select a date and time for your appointment.</Text>
                    <TouchableOpacity style={styles.createBtn} onPress={startCreateAppointment}>
                        <Text style={styles.createBtnText}>Create New Appointment</Text>
                    </TouchableOpacity>
                </View>

                {isLoading && (
                    <View style={styles.centerBox}>
                        <ActivityIndicator color="#3D3F8F" />
                    </View>
                )}

                {!isLoading && loadError && (
                    <View style={styles.centerBox}>
                        <Text style={styles.errorText}>{loadError}</Text>
                        <TouchableOpacity onPress={() => loadAppointments()}>
                            <Text style={styles.retryText}>Tap to retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!isLoading && !loadError && appointments.length === 0 && (
                    <View style={styles.centerBox}>
                        <Text style={styles.emptyText}>No appointments yet. Create one above.</Text>
                    </View>
                )}

                {!isLoading && !loadError && appointments.map((a) => (
                    <AppointmentCard key={a.id || a._id} appointment={a} />
                ))}
            </ScrollView>

            {pickerStep && (
                <DateTimePicker
                    value={pickedDate}
                    mode={pickerStep}
                    display="default"
                    onChange={handlePickerChange}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 20, gap: 16 },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    introCard: { backgroundColor: '#2D3178', borderRadius: 20, padding: 20, gap: 20 },
    introText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', lineHeight: 24 },
    createBtn: { backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
    createBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
    card: { backgroundColor: '#2D3178', borderRadius: 20, padding: 20 },
    badge: { position: 'absolute', top: 16, right: 0, backgroundColor: '#F5D76E', paddingVertical: 6, paddingHorizontal: 16, borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
    badgeText: { color: '#5C4400', fontSize: 13, fontWeight: '700' },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#8B8FBF', justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    doctorName: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    specialty: { color: '#D8DAEC', fontSize: 15, marginTop: 2 },
    dateLabel: { color: '#D8DAEC', fontSize: 14, marginTop: 8 },
    hospital: { color: '#B7BAE0', fontSize: 13, marginTop: 4 },
    centerBox: { alignItems: 'center', paddingVertical: 24, gap: 10 },
    errorText: { color: '#B3261E', fontSize: 15, textAlign: 'center' },
    retryText: { color: '#3D3F8F', fontSize: 15, fontWeight: '600' },
    emptyText: { color: '#6B6E9E', fontSize: 15, textAlign: 'center' },
})
