import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'

export default function NameRow({ value, onChangeText, onDelete, placeholder = 'Name' }) {
    return (
        <View style={styles.row}>
            <View style={styles.bullet} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9B9ECC"
                value={value}
                onChangeText={onChangeText}
            />
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                <Text style={styles.deleteIcon}>🗑</Text>
                <Text style={styles.deleteLabel}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, paddingHorizontal: 16, gap: 10 },
    bullet: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: '#3D3F8F' },
    input: { flex: 1, fontSize: 16, color: '#1A1A1A' },
    deleteBtn: { alignItems: 'center' },
    deleteIcon: { fontSize: 15, color: '#3D3F8F' },
    deleteLabel: { fontSize: 11, color: '#3D3F8F', fontWeight: '600', marginTop: -2 },
})
