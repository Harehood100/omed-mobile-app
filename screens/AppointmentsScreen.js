import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native'
// npm install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker'

const initialAppointments = [
    {
        id: '1',
        doctorName: 'Dr. John Adams',
        specialty: 'General Practitioner',
        dateLabel: 'Tuesday, July 30 . 10:00AM',
        status: 'Approved',
    },
]

function initials(name) {
    return name
        .replace('Dr.', '')
        .trim()
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
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
                    <Text style={styles.specialty}>{appointment.specialty}</Text>
                    <Text style={styles.dateLabel}>{appointment.dateLabel}</Text>
                </View>
            </View>
        </View>
    )
}

export default function AppointmentsScreen({ navigation, route }) {
    const [appointments, setAppointments] = useState(initialAppointments)
    const [pickerStep, setPickerStep] = useState(null) // null | 'date' | 'time'
    const [pickedDate, setPickedDate] = useState(new Date())

    // Merge in a newly-saved appointment coming back from ConfirmAppointmentScreen
    useEffect(() => {
        const newAppointment = route?.params?.newAppointment
        if (newAppointment) {
            setAppointments((prev) => [newAppointment, ...prev])
            navigation.setParams({ newAppointment: undefined })
        }
    }, [route?.params?.newAppointment])

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
            <ScrollView contentContainerStyle={styles.scroll}>
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

                {appointments.map((a) => (
                    <AppointmentCard key={a.id} appointment={a} />
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
})
