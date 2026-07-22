import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import FormInput from '../components/FormInput'
import Checkbox from '../components/Checkbox'
import Biometrics from '../components/Biometrics'

export default function WelcomeBackScreen({ navigation }) {
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const userName = 'John'
    const userEmail = 'johndoe@email.com'

    return (
        <SafeAreaView style={styles.screen}>
            {/* Decorative circles */}
            <View style={styles.circleTopRight} />
            <View style={styles.circleMidLeft} />
            <View style={styles.circleBottomRight} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Welcome Back" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <FormInput value={userEmail} editable={false} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Password</Text>
                    <FormInput placeholder="••••••••••" value={password} onChangeText={setPassword} isPassword />
                    <View style={styles.gap} />

                    <Checkbox checked={rememberMe} onPress={() => setRememberMe(!rememberMe)} label="Remember me" />

                    <Text style={styles.or}>Or</Text>
                    <Biometrics />
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.btnText}>Continue as {userName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login', { source: 'switchAccount' })}>
                        <Text style={styles.btnText}>Switch Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { flexGrow: 1, justifyContent: 'space-between' },
    circleTopRight: { position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleMidLeft: { position: 'absolute', top: 200, left: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomRight: { position: 'absolute', bottom: 100, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    form: { paddingHorizontal: 24, paddingTop: 20, zIndex: 1 },
    label: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
    gap: { height: 20 },
    or: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1A1A1A', marginVertical: 24 },
    bottom: { paddingHorizontal: 24, paddingBottom: 40, gap: 14, zIndex: 1 },
    btn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    btnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
