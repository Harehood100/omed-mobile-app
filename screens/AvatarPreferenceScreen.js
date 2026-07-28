import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import SuccessModal from '../components/SuccessModal'

const AVATARS = ['🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🐵', '🐧']

export default function AvatarPreferenceScreen({ navigation }) {
    const [selected, setSelected] = useState(AVATARS[0])
    const [showModal, setShowModal] = useState(false)

    const handleSave = () => {
        // TODO: wire up to a real "update notification settings" / avatar endpoint once available.
        setShowModal(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Avatar Preference" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Choose Your Avatar</Text>
                    <View style={styles.grid}>
                        {AVATARS.map((avatar) => {
                            const isSelected = selected === avatar
                            return (
                                <TouchableOpacity
                                    key={avatar}
                                    style={[styles.avatarCell, isSelected && styles.avatarCellSelected]}
                                    onPress={() => setSelected(avatar)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.avatarEmoji}>{avatar}</Text>
                                </TouchableOpacity>
                            )
                        })}
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
                title="Avatar Saved Successfully"
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
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
    avatarCell: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#D8DAEC', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    avatarCellSelected: { borderColor: PRIMARY, backgroundColor: '#EEEFFA' },
    avatarEmoji: { fontSize: 34 },
    bottom: { paddingHorizontal: 24, paddingTop: 40 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
