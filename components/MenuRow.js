import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'

export default function MenuRow({ icon, label, onPress }) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.iconWrap}>
                <Text style={styles.iconText}>{icon}</Text>
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D8DAEC', borderRadius: 30, paddingVertical: 16, paddingHorizontal: 14, gap: 14 },
    iconWrap: { position: 'absolute', left: 8, width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    iconText: { fontSize: 18 },
    label: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
})
