import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'

export default function Checkbox({ checked, onPress, label }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.7}>
            <View style={[styles.box, checked && styles.boxChecked]}>
                {checked && <Text style={styles.tick}>✓</Text>}
            </View>
            {label ? <Text style={styles.label}>{label}</Text> : null}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    box: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    boxChecked: { backgroundColor: '#3D3F8F' },
    tick: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
    label: { fontSize: 16, color: '#1A1A1A' },
})
