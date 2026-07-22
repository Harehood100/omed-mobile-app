import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function Biometrics() {
    return (
        <View style={styles.row}>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.icon}>𝍖</Text>
                <Text style={styles.label}>Fingerprint</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.icon}>⊡</Text>
                <Text style={styles.label}>Face Scan</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'center', gap: 60 },
    btn: { alignItems: 'center', gap: 8 },
    icon: { fontSize: 36, color: '#3D3F8F' },
    label: { fontSize: 16, color: '#3D3F8F', fontWeight: '600' },
})
