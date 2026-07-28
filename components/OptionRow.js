import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'

export default function OptionRow({ label, selected, onPress }) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center' },
    radioSelected: { borderColor: '#3D3F8F' },
    radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3D3F8F' },
    label: { fontSize: 17, color: '#1A1A1A', fontWeight: '500' },
})
