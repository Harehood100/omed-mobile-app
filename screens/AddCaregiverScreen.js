import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import ScreenHeader from '../components/ScreenHeader'
import FormInput from '../components/FormInput'

export default function AddCaregiverScreen({ navigation }) {
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [role, setRole] = useState('')

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <ScreenHeader title="Add Caregiver" onBack={() => navigation.goBack()} />

                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Enter Caregiver's Details</Text>

                    <Text style={styles.label}>Name</Text>
                    <FormInput placeholder="Name" value={name} onChangeText={setName} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Phone Number or Email</Text>
                    <FormInput placeholder="Phone Number or Email" value={contact} onChangeText={setContact} />
                    <View style={styles.gap} />

                    <Text style={styles.label}>Role (Caregiver/Child)</Text>
                    <FormInput placeholder="Role" value={role} onChangeText={setRole} />
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity
                        style={styles.continueBtn}
                        onPress={() => navigation.navigate('GenerateCode', { name, contact, role })}
                    >
                        <Text style={styles.continueBtnText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -60, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0', zIndex: 0 },
    scroll: { flexGrow: 1, justifyContent: 'space-between', zIndex: 1 },
    form: { paddingHorizontal: 24, paddingTop: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
    gap: { height: 20 },
    bottom: { paddingHorizontal: 24, paddingBottom: 40 },
    continueBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: '#3D3F8F', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { fontSize: 18, color: '#3D3F8F', fontWeight: '600' },
})
