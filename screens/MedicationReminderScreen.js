import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native'
import SuccessModal from '../components/SuccessModal'

const OFFSET_OPTIONS = [5, 10, 15, 30, 60]

export default function MedicationReminderScreen({ navigation, route }) {
    const medication = route?.params?.medication || ''

    const [minutesBefore, setMinutesBefore] = useState(null)
    const [showPicker, setShowPicker] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const offsetLabel = minutesBefore ? `${minutesBefore} minutes before exact time` : 'X minutes before exact time'

    const handleSave = () => {
        // No backend endpoint for reminders yet — this confirms locally.
        // TODO: wire up to a real reminders endpoint once the backend adds it.
        setShowSuccess(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Reminder For Medications</Text>
                </View>

                <Text style={styles.sectionTitle}>Set Reminder</Text>

                <View style={styles.form}>
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>For:</Text>
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>{medication || '—'}</Text>
                        </View>
                    </View>

                    <View style={styles.fieldRow}>
                        <View style={styles.alarmIconWrap}>
                            <Text style={styles.reminderIcon}>⏰</Text>
                            <Text style={styles.reminderPlus}>+</Text>
                        </View>
                        <TouchableOpacity style={styles.pill} onPress={() => setShowPicker(true)}>
                            <Text style={styles.pillText}>{offsetLabel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Minutes-before picker */}
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

            <SuccessModal
                visible={showSuccess}
                title="Reminder Set Successfully"
                onReturnHome={() => { setShowSuccess(false); navigation.navigate('Home') }}
                onClose={() => setShowSuccess(false)}
            />
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -40, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E4E4F2', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -60, left: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: '#E4E4F2', zIndex: 0 },
    scroll: { flexGrow: 1, zIndex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, gap: 16 },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', flexShrink: 1 },
    sectionTitle: { fontSize: 22, color: '#1A1A1A', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
    form: { paddingHorizontal: 24, gap: 20 },
    fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    fieldLabel: { fontSize: 16, color: '#1A1A1A' },
    alarmIconWrap: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: PRIMARY, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
    reminderIcon: { fontSize: 12 },
    reminderPlus: { position: 'absolute', bottom: -2, right: -2, fontSize: 11, color: PRIMARY, fontWeight: 'bold' },
    pill: { flex: 1, height: 48, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 24, justifyContent: 'center', paddingHorizontal: 18 },
    pillText: { fontSize: 15, color: PRIMARY },
    bottom: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
    pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    pickerCard: { backgroundColor: '#FFFFFF', borderRadius: 16, width: '100%', overflow: 'hidden' },
    pickerOption: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    pickerOptionText: { fontSize: 16, color: PRIMARY, textAlign: 'center' },
})
