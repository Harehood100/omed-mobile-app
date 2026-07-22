import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'

function makeCode() {
    return String(Math.floor(1000 + Math.random() * 9000))
}

export default function GenerateCodeScreen({ navigation, route }) {
    const [code, setCode] = useState('')
    const caregiver = route?.params || {}

    const handleCopy = () => {
        if (!code) return
        // Add @react-native-clipboard/clipboard if you want a real copy-to-clipboard.
        Alert.alert('Copied', `Code ${code} copied.`)
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopLeft} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Generate Code" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.instructions}>
                        Tap the button below to create your caregiver's connection code
                    </Text>

                    <View style={styles.codeBox}>
                        <Text style={styles.codeText}>{code}</Text>
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.pillBtn} onPress={() => setCode(makeCode())}>
                            <Text style={styles.pillBtnText}>Generate Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pillBtn} onPress={handleCopy}>
                            <Text style={styles.pillBtnText}>Copy Code</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.caption}>Copy and paste this code</Text>
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity
                        style={styles.continueBtn}
                        disabled={!code}
                        onPress={() => navigation.navigate('EnterAccessCode', { ...caregiver, code })}
                    >
                        <Text style={styles.continueBtnText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopLeft: { position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { flexGrow: 1, justifyContent: 'space-between', zIndex: 1 },
    form: { paddingHorizontal: 24, paddingTop: 20 },
    instructions: { fontSize: 16, color: '#1A1A1A', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
    codeBox: { height: 90, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    codeText: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A' },
    row: { flexDirection: 'row', gap: 14, marginBottom: 20 },
    pillBtn: { flex: 1, backgroundColor: '#2D3178', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
    pillBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    caption: { fontSize: 15, color: '#1A1A1A', textAlign: 'center' },
    bottom: { paddingHorizontal: 24, paddingBottom: 40 },
    continueBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
