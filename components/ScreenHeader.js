import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.backBtn} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backBtn: { width: 44, paddingTop: 4 },
  backArrow: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', textAlign: 'center', marginTop: 4, lineHeight: 20 },
})
