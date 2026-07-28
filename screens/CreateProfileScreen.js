import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '../components/ScreenHeader'
import FormInput from '../components/FormInput'
import Checkbox from '../components/Checkbox'
import Biometrics from '../components/Biometrics'
import RememberMeModal from '../components/RememberMeModal'
import { useAuth } from '../context/AuthContext'

export default function CreateProfileScreen({ navigation }) {
    const { register, login } = useAuth()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    const goToHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })

    const handleContinue = async () => {
        setFieldErrors({})

        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Missing info', 'Please fill in first name, last name, email, and password.')
            return
        }

        setIsSubmitting(true)
        try {
            // HealthNest's register endpoint creates the account but doesn't return tokens,
            // so we log in right after to start the session.
            await register({ firstName, lastName, email, password })
            await login({ email, password })

            if (!rememberMe) {
                setShowModal(true)
            } else {
                goToHome()
            }
        } catch (err) {
            if (err.errors) {
                setFieldErrors(err.errors)
                Alert.alert('Please fix the highlighted fields', Object.values(err.errors).flat().join('\n'))
            } else {
                Alert.alert('Sign up failed', err.message || 'Something went wrong. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Create Profile" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.label}>First Name</Text>
                    <FormInput placeholder="First name" value={firstName} onChangeText={setFirstName} />
                    {fieldErrors.firstName && <Text style={styles.errorText}>{fieldErrors.firstName.join(' ')}</Text>}
                    <View style={styles.gap} />

                    <Text style={styles.label}>Last Name</Text>
                    <FormInput placeholder="Last name" value={lastName} onChangeText={setLastName} />
                    {fieldErrors.lastName && <Text style={styles.errorText}>{fieldErrors.lastName.join(' ')}</Text>}
                    <View style={styles.gap} />

                    <Text style={styles.label}>Email</Text>
                    <FormInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    {fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email.join(' ')}</Text>}
                    <View style={styles.gap} />

                    <Text style={styles.label}>Password</Text>
                    <FormInput placeholder="Create Password" value={password} onChangeText={setPassword} isPassword />
                    {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password.join(' ')}</Text>}
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
                    <Text style={styles.loginText}>
                        Have a profile?{' '}
                        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login', { source: 'signup' })}>Log in</Text>
                    </Text>
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
    bottom: { paddingHorizontal: 24, paddingBottom: 32, gap: 14, alignItems: 'center' },
    continueBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
    loginText: { fontSize: 14, color: '#1A1A1A' },
    loginLink: { color: '#3D3F8F', fontWeight: 'bold', textDecorationLine: 'underline' },
})
