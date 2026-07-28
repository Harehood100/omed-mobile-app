import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function WelcomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.logoRow}>
                <View style={styles.logoCircle}>
                    <View style={styles.logoLine} />
                </View>
                <Text style={styles.logoText}>MED</Text>
            </View>
            <Text style={styles.tagline}>Helping you keep it together</Text>

            <Image
                source={require('../assets/medication-illustration.png')}
                style={styles.illustration}
                resizeMode="contain"
            />

            <Text style={styles.subtitle}>Input your medications{'\n'}with reminders</Text>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('CreateProfile')}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate('Login', { source: 'welcome' })}>
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, alignItems: 'center' },
    logoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 60 },
    logoCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: PRIMARY, justifyContent: 'center' },
    logoLine: { height: 2, backgroundColor: '#FFFFFF', width: '100%' },
    logoText: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A', marginLeft: 8 },
    tagline: { fontSize: 15, color: PRIMARY, fontWeight: '600', marginTop: 6 },
    illustration: { width: '100%', height: 260, marginTop: 40 },
    subtitle: { fontSize: 17, fontWeight: '600', color: PRIMARY, textAlign: 'center', marginTop: 24 },
    buttons: { width: '100%', marginTop: 'auto', marginBottom: 40, gap: 14 },
    signUpBtn: { width: '100%', height: 56, borderRadius: 30, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' },
    signUpText: { fontSize: 18, color: '#FFFFFF', fontWeight: '600' },
    signInBtn: { width: '100%', height: 56, borderRadius: 30, borderWidth: 1.5, borderColor: PRIMARY, justifyContent: 'center', alignItems: 'center' },
    signInText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
