import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function SuccessModal({ visible, title, message, onDone }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.check}>✓</Text>
                    </View>
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    card: { backgroundColor: '#2D3178', borderRadius: 20, padding: 28, alignItems: 'center', gap: 16, width: '100%' },
    title: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    badge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
    check: { fontSize: 32, color: '#2D3178', fontWeight: 'bold' },
    message: { color: '#FFFFFF', fontSize: 15, textAlign: 'center', lineHeight: 22 },
    doneBtn: { backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
    doneBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
})
