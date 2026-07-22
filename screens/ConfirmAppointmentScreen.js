import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function Row({ label, value }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}:</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    )
}

export default function ConfirmAppointmentScreen({ navigation, route }) {
    const { date, time, notes, reminderDate } = route?.params || {}

    const handleSave = () => {
        const newAppointment = {
            id: String(Date.now()),
            doctorName: notes || 'New Appointment',
            specialty: 'General Practitioner',
            dateLabel: `${formatDate(date)} . ${time}`,
            status: null,
        }
        navigation.navigate('Appointments', { newAppointment })
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
                <Row label="Date" value={formatDate(date)} />
                <Row label="Time" value={time} />
                <Row label="Notes" value={notes || '—'} />
                <Row label="Reminder" value={formatDate(reminderDate)} />
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save Appointment</Text>
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
    rowValue: { fontSize: 16, color: '#3D3F8F' },
    bottom: { paddingHorizontal: 24, paddingTop: 40 },
    saveBtn: { width: '100%', height: 56, backgroundColor: '#2D3178', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
})
