import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import OptionRow from '../components/OptionRow'
import Checkbox from '../components/Checkbox'
import SuccessModal from '../components/SuccessModal'

const SOUND_OPTIONS = ['Default', 'Chime', 'Bell', 'Silent']

export default function SoundSettingsScreen({ navigation }) {
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [selectedSound, setSelectedSound] = useState('Default')
    const [showModal, setShowModal] = useState(false)

    const handleSave = () => {
        // TODO: wire up to a real "update notification settings" endpoint once available.
        setShowModal(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Sound Settings" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Enable Sound</Text>
                        <Checkbox checked={soundEnabled} onPress={() => setSoundEnabled(!soundEnabled)} />
                    </View>
                    <View style={styles.gap} />

                    <Text style={styles.sectionTitle}>Alert Sound</Text>
                    <View style={styles.optionsWrap}>
                        {SOUND_OPTIONS.map((option) => (
                            <OptionRow
                                key={option}
                                label={option}
                                selected={selectedSound === option}
                                onPress={() => soundEnabled && setSelectedSound(option)}
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
                title="Sound Settings Saved Successfully"
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
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 4 },
    toggleLabel: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
    gap: { height: 28 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
    optionsWrap: { gap: 2 },
    bottom: { paddingHorizontal: 24, paddingTop: 40 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
