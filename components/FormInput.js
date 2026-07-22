import { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'

export default function FormInput({ placeholder, value, onChangeText, isPassword = false, keyboardType, editable = true }) {
    const [show, setShow] = useState(false)
    return (
        <View style={[styles.box, !editable && styles.boxDisabled]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9B9ECC"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isPassword && !show}
                keyboardType={keyboardType}
                autoCapitalize="none"
                editable={editable}
            />
            {isPassword && (
                <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeBtn}>
                    <Text style={styles.eye}>{show ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, paddingHorizontal: 18, height: 56 },
    boxDisabled: { backgroundColor: '#F5F5F5' },
    input: { flex: 1, fontSize: 16, color: '#1A1A1A' },
    eyeBtn: { padding: 4 },
    eye: { fontSize: 18 },
})
