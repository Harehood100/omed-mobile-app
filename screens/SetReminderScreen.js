import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, Alert } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import FormInput from '../components/FormInput'

const OFFSET_OPTIONS = [5, 10, 15, 30, 60]

export default function SetReminderScreen({ navigation, route }) {
    const { date, time } = route?.params || {}

    const [hospitalName, setHospitalName] = useState('')
    const [doctorName, setDoctorName] = useState('')
    const [doctorSpeciality, setDoctorSpeciality] = useState('')
    const [notes, setNotes] = useState('')
    const [minutesBefore, setMinutesBefore] = useState(30)
    const [showPicker, setShowPicker] = useState(false)

    const offsetLabel = `${minutesBefore} minutes before`

    const handleContinue = () => {
        if (!hospitalName.trim() || !doctorName.trim()) {
            Alert.alert('Missing info', 'Please enter at least the hospital and doctor name.')
            return
        }

        navigation.navigate('ConfirmAppointment', {
            date,
            time,
            hospitalName: hospitalName.trim(),
            doctorName: doctorName.trim(),
            doctorSpeciality: doctorSpeciality.trim(),
            notes: notes.trim(),
            minutesBefore,
        })
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Set Reminder" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.label}>Hospital Name</Text>
                    <FormInput placeholder="e.g. Lagoon Hospital" value={hospitalName} onChangeText={setHospitalName} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Doctor Name</Text>
                    <FormInput placeholder="e.g. Dr Michael Ade" value={doctorName} onChangeText={setDoctorName} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Doctor Speciality</Text>
                    <FormInput placeholder="e.g. Cardiologist" value={doctorSpeciality} onChangeText={setDoctorSpeciality} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Notes</Text>
                    <FormInput placeholder="e.g. Annual checkup" value={notes} onChangeText={setNotes} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Remind Me</Text>
                    <TouchableOpacity style={styles.pill} onPress={() => setShowPicker(true)}>
                        <Text style={styles.pillText}>{offsetLabel}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                        <Text style={styles.continueBtnText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={showPicker} transparent animationType="fade">
                <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowPicker(false)}>
                    <View style={styles.pickerCard}>
                        {OFFSET_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                style={styles.pickerOption}
                                onPress={() => { setMinutesBefore(opt); setShowPicker(false) }}
                            >
                                <Text style={styles.pickerOptionText}>{opt} minutes before</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1 },
    form: { paddingHorizontal: 24, paddingTop: 10 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
    gap: { height: 18 },
    pill: { height: 48, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 24, justifyContent: 'center', paddingHorizontal: 18 },
    pillText: { fontSize: 15, color: PRIMARY },
    bottom: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
    continueBtn: { width: '100%', height: 56, backgroundColor: '#2D3178', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
    pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    pickerCard: { backgroundColor: '#FFFFFF', borderRadius: 16, width: '100%', overflow: 'hidden' },
    pickerOption: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    pickerOptionText: { fontSize: 16, color: PRIMARY, textAlign: 'center' },
})
