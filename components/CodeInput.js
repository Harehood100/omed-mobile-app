import { useRef } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

export default function CodeInput({ length = 4, value, onChangeValue }) {
    const inputRefs = useRef([])
    const digits = value.split('')

    const handleChange = (text, index) => {
        const next = digits.slice()
        next[index] = text.slice(-1)
        const joined = next.join('').slice(0, length)
        onChangeValue(joined)

        if (text && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    return (
        <View style={styles.row}>
            {Array.from({ length }).map((_, i) => (
                <TextInput
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    style={styles.box}
                    value={digits[i] || ''}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 14 },
    box: { width: 60, height: 60, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 12, fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
})
