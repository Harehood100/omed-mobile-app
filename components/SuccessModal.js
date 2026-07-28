import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// Two usage modes:
// 1) Two buttons (default):  <SuccessModal visible title="..." onReturnHome={...} onClose={...} />
// 2) Single button:           <SuccessModal visible title="..." onDone={...} />
export default function SuccessModal({ visible, title, message, onReturnHome, onClose, onDone }) {
    const showTwoButtons = !!(onReturnHome || onClose)

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.check}>✓</Text>
                    </View>
                    {message ? <Text style={styles.message}>{message}</Text> : null}

                    {showTwoButtons ? (
                        <>
                            <TouchableOpacity style={styles.btn} onPress={onReturnHome}>
                                <Text style={styles.btnText}>Return Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={onClose}>
                                <Text style={styles.btnText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.btn} onPress={onDone}>
                            <Text style={styles.btnText}>Done</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    card: { backgroundColor: '#2D3178', borderRadius: 20, padding: 28, alignItems: 'center', gap: 16, width: '100%' },
    title: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    badge: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
    check: { fontSize: 40, color: '#2D3178', fontWeight: 'bold' },
    message: { color: '#FFFFFF', fontSize: 15, textAlign: 'center', lineHeight: 22 },
    btn: { backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 14, width: '100%', alignItems: 'center' },
    btnText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' },
})

