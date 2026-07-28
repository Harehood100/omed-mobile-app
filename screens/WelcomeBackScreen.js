import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native'
import FormInput from '../components/FormInput'
import Biometrics from '../components/Biometrics'
import { useAuth } from '../context/AuthContext'

export default function WelcomeBackScreen({ navigation }) {
    const { lastKnownUser, login, forgetLastKnownUser } = useAuth()
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const name = lastKnownUser?.firstName || 'there'
    const email = lastKnownUser?.email || ''

    const handleContinue = async () => {
        setErrorMessage('')
        if (!password) {
            Alert.alert('Missing password', 'Please enter your password to continue.')
            return
        }

        setIsSubmitting(true)
        try {
            await login({ email, password })
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        } catch (err) {
            setErrorMessage(err.message || 'Incorrect password. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSwitchAccount = async () => {
        await forgetLastKnownUser()
        navigation.reset({ index: 0, routes: [{ name: 'Login', params: { source: 'switchAccount' } }] })
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome back, {name}!</Text>
                    <Text style={styles.subtitle}>Enter your password to continue as {email}</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Password</Text>
                    <FormInput placeholder="Password" value={password} onChangeText={setPassword} isPassword />
                    {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                    <Text style={styles.or}>Or</Text>
                    <Biometrics />
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.continueBtnText}>Continue</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSwitchAccount} style={styles.switchLink}>
                        <Text style={styles.switchLinkText}>Not you? Switch account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1, justifyContent: 'space-between' },
    header: { paddingHorizontal: 24, paddingTop: 80 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' },
    subtitle: { fontSize: 15, color: '#6B6E9E', marginTop: 8 },
    form: { paddingHorizontal: 24, paddingTop: 40 },
    label: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
    errorText: { color: '#D64545', fontSize: 13, marginTop: 6 },
    or: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1A1A1A', marginVertical: 24 },
    bottom: { paddingHorizontal: 24, paddingBottom: 32, gap: 16, alignItems: 'center' },
    continueBtn: { width: '100%', height: 56, backgroundColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { fontSize: 18, color: '#FFFFFF', fontWeight: '600' },
    switchLink: { padding: 8 },
    switchLinkText: { fontSize: 15, color: PRIMARY, fontWeight: '600', textDecorationLine: 'underline' },
})
