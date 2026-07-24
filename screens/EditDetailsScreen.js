import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import FormInput from '../components/FormInput'
import NameRow from '../components/NameRow'
import SuccessModal from '../components/SucessModal'

let nextId = 1
const makeId = () => String(nextId++)

export default function EditDetailsScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [biometrics, setBiometrics] = useState([{ id: makeId(), name: '' }, { id: makeId(), name: '' }])
    const [showModal, setShowModal] = useState(false)

    const updateBiometric = (id, name) => {
        setBiometrics((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)))
    }

    const deleteBiometric = (id) => {
        setBiometrics((prev) => prev.filter((b) => b.id !== id))
    }

    const addBiometric = () => {
        setBiometrics((prev) => [...prev, { id: makeId(), name: '' }])
    }

    const handleSave = () => {
        // TODO: wire up to a real "update profile" / biometrics endpoint once available.
        setShowModal(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomRight} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Edit Details" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.label}>Change Email</Text>
                    <FormInput placeholder="Change Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Change Password</Text>
                    <FormInput placeholder="Change Password" value={password} onChangeText={setPassword} isPassword />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Thumbprint / Face Scan</Text>
                    <View style={styles.rowsGap}>
                        {biometrics.map((b) => (
                            <NameRow
                                key={b.id}
                                value={b.name}
                                onChangeText={(text) => updateBiometric(b.id, text)}
                                onDelete={() => deleteBiometric(b.id)}
                            />
                        ))}
                    </View>
                    <View style={styles.gap} />

                    {/* Placeholder actions — hook up to real biometric enrollment (e.g. expo-local-authentication) when ready. */}
                    <TouchableOpacity style={styles.addBtn} onPress={addBiometric} activeOpacity={0.8}>
                        <View style={styles.addIconWrap}><Text style={styles.addIcon}>👆</Text></View>
                        <Text style={styles.addLabel}>Add Thumbprint</Text>
                    </TouchableOpacity>
                    <View style={styles.smallGap} />
                    <TouchableOpacity style={styles.addBtn} onPress={addBiometric} activeOpacity={0.8}>
                        <View style={styles.addIconWrap}><Text style={styles.addIcon}>🙂</Text></View>
                        <Text style={styles.addLabel}>Add Face Scan</Text>
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
                title="Details Saved Successfully"
                onReturnHome={() => { setShowModal(false); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }}
                onClose={() => setShowModal(false)}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomRight: { position: 'absolute', bottom: -100, right: -100, width: 260, height: 260, borderRadius: 130, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { paddingBottom: 40, zIndex: 1 },
    form: { paddingHorizontal: 24, paddingTop: 20 },
    label: { fontSize: 20, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 },
    gap: { height: 24 },
    smallGap: { height: 12 },
    rowsGap: { gap: 12 },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D8DAEC', borderRadius: 30, padding: 14, gap: 14 },
    addIconWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    addIcon: { fontSize: 18 },
    addLabel: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
    bottom: { paddingHorizontal: 24, paddingTop: 32 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
