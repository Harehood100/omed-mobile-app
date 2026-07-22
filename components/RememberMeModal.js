import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function RememberMeModal({ visible, onContinue, onGoBack }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.text}>
                        Hello! You didn't click{' '}
                        <Text style={styles.bold}>"Remember me"</Text>
                        {' '}If you choose to continue with this off you will have to input your details again. Would you still like to continue into the app?
                    </Text>
                    <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
                        <Text style={styles.continueBtnText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.goBackBtn} onPress={onGoBack}>
                        <Text style={styles.goBackText}>Go back and click "Remember me"</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    card: { backgroundColor: '#2D3178', borderRadius: 16, padding: 28, alignItems: 'center', gap: 16 },
    text: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', lineHeight: 26 },
    bold: { fontWeight: 'bold' },
    continueBtn: { backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
    continueBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
    goBackBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 30, paddingVertical: 10, paddingHorizontal: 20, width: '100%', alignItems: 'center' },
    goBackText: { color: '#FFFFFF', fontSize: 13, textAlign: 'center' },
})
