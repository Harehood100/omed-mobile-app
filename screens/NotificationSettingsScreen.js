import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import Checkbox from '../components/Checkbox'
import SuccessModal from '../components/SucessModal'

export default function NotificationSettingsScreen({ navigation }) {
    const [displayAvatar, setDisplayAvatar] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const handleSave = () => {
        // TODO: wire up to a real "update notification settings" endpoint once available.
        setShowModal(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleNotch} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Notification Settings" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    {/* Sub-settings screens aren't built yet — hook these up once they exist. */}
                    <TouchableOpacity style={styles.pillField} activeOpacity={0.7} onPress={() => { }}>
                        <Text style={styles.pillText}>Sound Settings</Text>
                    </TouchableOpacity>
                    <View style={styles.gap} />

                    <TouchableOpacity style={styles.pillFieldTall} activeOpacity={0.7} onPress={() => { }}>
                        <Text style={styles.pillText}>Vibration{'\n'}Settings</Text>
                    </TouchableOpacity>
                    <View style={styles.gap} />

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={() => { }}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>🐶</Text></View>
                        <Text style={styles.menuLabel}>Avatar Preference</Text>
                    </TouchableOpacity>
                    <View style={styles.gap} />

                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Display Avatar</Text>
                        <Checkbox checked={displayAvatar} onPress={() => setDisplayAvatar(!displayAvatar)} />
                    </View>
                    <View style={styles.gap} />

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={() => { }}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>🐶</Text></View>
                        <Text style={styles.menuLabel}>Change Avatar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <SuccessModal
                visible={showModal}
                title="Notification Saved Successfully"
                onReturnHome={() => { setShowModal(false); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }}
                onClose={() => setShowModal(false)}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -70, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleNotch: { position: 'absolute', top: 340, right: 30, width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -160, left: -100, width: 340, height: 340, borderRadius: 170, backgroundColor: '#EDEEF5', zIndex: 0 },
    scroll: { paddingBottom: 60, zIndex: 1 },
    form: { paddingHorizontal: 24, paddingTop: 20 },
    gap: { height: 20 },
    pillField: { height: 52, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 26, justifyContent: 'center', paddingHorizontal: 20 },
    pillFieldTall: { minHeight: 52, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 26, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    pillText: { fontSize: 16, color: '#9B9ECC' },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D8DAEC', borderRadius: 30, padding: 12, gap: 14 },
    iconWrap: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    iconText: { fontSize: 16 },
    menuLabel: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 4 },
    toggleLabel: { fontSize: 17, color: '#1A1A1A' },
    bottom: { paddingHorizontal: 24, paddingTop: 30 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
