import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Vibration } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import OptionRow from '../components/OptionRow'
import SuccessModal from '../components/SuccessModal'

// Patterns are [wait, vibrate, wait, vibrate, ...] in milliseconds, as expected by RN's Vibration API.
const VIBRATION_OPTIONS = [
    { label: 'Off', pattern: null },
    { label: 'Short Pulse', pattern: [0, 200] },
    { label: 'Long Pulse', pattern: [0, 600] },
    { label: 'Double Pulse', pattern: [0, 150, 150, 150] },
]

export default function VibrationSettingsScreen({ navigation }) {
    const [selected, setSelected] = useState('Short Pulse')
    const [showModal, setShowModal] = useState(false)

    const handleSelect = (option) => {
        setSelected(option.label)
        if (option.pattern) Vibration.vibrate(option.pattern)
    }

    const handleSave = () => {
        // TODO: wire up to a real "update notification settings" endpoint once available.
        setShowModal(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Vibration Settings" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.hint}>Tap an option to preview it on your device.</Text>
                    <View style={styles.optionsWrap}>
                        {VIBRATION_OPTIONS.map((option) => (
                            <OptionRow
                                key={option.label}
                                label={option.label}
                                selected={selected === option.label}
                                onPress={() => handleSelect(option)}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <SuccessModal
                visible={showModal}
                title="Vibration Settings Saved Successfully"
                onReturnHome={() => { setShowModal(false); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }}
                onClose={() => setShowModal(false)}
            />
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -70, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -100, left: -80, width: 240, height: 240, borderRadius: 120, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { paddingBottom: 60, zIndex: 1 },
    form: { paddingHorizontal: 24, paddingTop: 20 },
    hint: { fontSize: 14, color: '#6B6E9E', marginBottom: 12 },
    optionsWrap: { gap: 2 },
    bottom: { paddingHorizontal: 24, paddingTop: 40 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
