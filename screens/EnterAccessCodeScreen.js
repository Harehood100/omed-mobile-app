import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import CodeInput from '../components/CodeInput'
import SuccessModal from '../components/SuccessModal'

export default function EnterAccessCodeScreen({ navigation, route }) {
    const { name, contact, role, code: expectedCode } = route?.params || {}

    const [enteredCode, setEnteredCode] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)

    const handleConfirm = () => {
        if (enteredCode.length < 4) {
            Alert.alert('Incomplete code', 'Please enter the full 4-digit code.')
            return
        }
        if (enteredCode !== expectedCode) {
            Alert.alert('Incorrect code', "That code doesn't match. Please check and try again.")
            return
        }
        // No backend endpoint for caregiver connections yet — this confirms locally.
        // TODO: wire up to a real caregivers endpoint once the backend adds it.
        setShowSuccess(true)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Enter Access Code" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.instructions}>
                        Enter the code {name ? `to confirm ${name}` : 'to confirm your caregiver'} as{' '}
                        {role || 'a caregiver'}
                        {contact ? ` (${contact})` : ''}
                    </Text>

                    <View style={styles.codeWrap}>
                        <CodeInput length={4} value={enteredCode} onChangeValue={setEnteredCode} />
                    </View>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                        <Text style={styles.confirmBtnText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <SuccessModal
                visible={showSuccess}
                title="Caregiver Connected Successfully"
                onReturnHome={() => {
                    setShowSuccess(false)
                    navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
                }}
                onClose={() => setShowSuccess(false)}
            />
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -60, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { flexGrow: 1, justifyContent: 'space-between', zIndex: 1 },
    form: { paddingHorizontal: 24, paddingTop: 30, alignItems: 'center' },
    instructions: { fontSize: 16, color: '#1A1A1A', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    codeWrap: { alignItems: 'center' },
    bottom: { paddingHorizontal: 24, paddingBottom: 40 },
    confirmBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    confirmBtnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
