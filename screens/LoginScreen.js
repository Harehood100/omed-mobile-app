import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import FormInput from '../components/FormInput'
import Checkbox from '../components/Checkbox'
import Biometrics from '../components/Biometrics'
import RememberMeModal from '../components/RememberMeModal'
import { useAuth } from '../context/AuthContext'

// source = 'signup'      → came from Create Profile "Log in" link
// source = 'switchAccount' → came from Welcome Back "Switch Account"
export default function LoginScreen({ navigation, route }) {
    const source = route?.params?.source || 'signup'
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const goToHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })

    const handleContinue = async () => {
        setErrorMessage('')

        if (!email || !password) {
            Alert.alert('Missing info', 'Please enter your email and password.')
            return
        }

        setIsSubmitting(true)
        try {
            await login({ email, password })
            if (!rememberMe) {
                setShowModal(true)
            } else {
                goToHome()
            }
        } catch (err) {
            // 400/401 from HealthNest both come back with a message but no field-level errors for login
            setErrorMessage(err.message || 'Invalid email or password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader
                    title="Log in"
                    subtitle={'Remember to save your details so\nyou dont have to input them again'}
                    onBack={() => navigation.goBack()}
                />

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <FormInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Password</Text>
                    <FormInput placeholder="Create Password" value={password} onChangeText={setPassword} isPassword />
                    {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    <View style={styles.gap} />

                    <Checkbox checked={rememberMe} onPress={() => setRememberMe(!rememberMe)} label="Remember me" />

                    <Text style={styles.or}>Or</Text>
                    <Biometrics />
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color="#3D3F8F" />
                        ) : (
                            <Text style={styles.continueBtnText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <RememberMeModal
                visible={showModal}
                onContinue={() => { setShowModal(false); goToHome() }}
                onGoBack={() => setShowModal(false)}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1, justifyContent: 'space-between' },
    form: { paddingHorizontal: 24, paddingTop: 20 },
    label: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
    gap: { height: 20 },
    errorText: { color: '#D64545', fontSize: 13, marginTop: 6 },
    or: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1A1A1A', marginVertical: 24 },
    bottom: { paddingHorizontal: 24, paddingBottom: 32 },
    continueBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
