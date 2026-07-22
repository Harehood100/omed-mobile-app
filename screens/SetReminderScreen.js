import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch, Platform } from 'react-native'
// npm install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker'
import FormInput from '../components/FormInput'

function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function SetReminderScreen({ navigation, route }) {
    const appointmentDate = route?.params?.date ? new Date(route.params.date) : new Date()
    const appointmentTime = route?.params?.time || '10:30AM'

    const [reminderDate, setReminderDate] = useState(appointmentDate)
    const [showPicker, setShowPicker] = useState(false)
    const [soundAlert, setSoundAlert] = useState(false)
    // Not shown in the Figma screen for Set Reminder, but Confirm Appointment
    // displays a Notes value — adding an optional field here so that data exists.
    const [notes, setNotes] = useState('')

    const handlePickerChange = (event, selectedDate) => {
        setShowPicker(Platform.OS === 'ios')
        if (selectedDate) setReminderDate(selectedDate)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Set Reminder</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Remind Me Before</Text>
                    <TouchableOpacity style={styles.dateField} onPress={() => setShowPicker(true)}>
                        <Text style={styles.dateText}>{formatDate(reminderDate)}</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            value={reminderDate}
                            mode="date"
                            display="default"
                            onChange={handlePickerChange}
                        />
                    )}
                    <View style={styles.gap} />

                    <Text style={styles.label}>Sound Alert</Text>
                    <View style={styles.toggleField}>
                        <Text style={styles.toggleLabel}>Sound Reminder</Text>
                        <Switch
                            value={soundAlert}
                            onValueChange={setSoundAlert}
                            trackColor={{ false: '#D0D3E8', true: '#3D3F8F' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                    <View style={styles.gap} />

                    <Text style={styles.label}>Notes (optional)</Text>
                    <FormInput placeholder="e.g. Doctor's Visit" value={notes} onChangeText={setNotes} />
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity
                        style={styles.continueBtn}
                        onPress={() =>
                            navigation.navigate('ConfirmAppointment', {
                                date: appointmentDate.toISOString(),
                                time: appointmentTime,
                                notes,
                                reminderDate: reminderDate.toISOString(),
                                soundAlert,
                            })
                        }
                    >
                        <Text style={styles.continueBtnText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1, justifyContent: 'space-between' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, gap: 16 },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    form: { paddingHorizontal: 24, paddingTop: 24 },
    label: { fontSize: 15, fontWeight: 'bold', color: '#3D3F8F', marginBottom: 10 },
    dateField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, paddingHorizontal: 18 },
    dateText: { fontSize: 16, color: '#1A1A1A' },
    chevron: { fontSize: 20, color: '#3D3F8F', fontWeight: 'bold' },
    toggleField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, paddingHorizontal: 18 },
    toggleLabel: { fontSize: 16, color: '#9B9ECC' },
    gap: { height: 24 },
    bottom: { paddingHorizontal: 24, paddingBottom: 40 },
    continueBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
