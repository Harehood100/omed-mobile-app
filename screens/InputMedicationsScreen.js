import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SuccessModal from '../components/SuccessModal'
import { createMedication } from '../api/medications'
import { parseTimeString, toHHMM } from '../lib/medicationTime'
import { extractErrorMessage } from '../lib/errorMessage'

let nextId = 1
const makeRow = () => ({ id: nextId++, text: '', savedId: null, savingReminder: false })

const todayISO = () => new Date().toISOString().slice(0, 10)

// "Medication Name, Dosage, Time" -> { name, dosage, time }
function parseRow(text) {
    const parts = text.split(',').map((p) => p.trim()).filter(Boolean)
    return { name: parts[0] || '', dosage: parts[1] || '', time: parts[2] || '' }
}

function buildMedicationPayload({ name, dosage, time }) {
    const parsedTime = parseTimeString(time)
    return {
        name,
        dosage,
        // Not collected by this form yet — using a sensible default.
        // TODO: add a real frequency picker to this screen if per-medication frequency matters.
        frequency: 'Once Daily',
        reminderTime: parsedTime ? [toHHMM(parsedTime)] : [],
        startDate: todayISO(),
        instructions: '',
    }
}

export default function InputMedicationsScreen({ navigation }) {
    const [rows, setRows] = useState(() => Array.from({ length: 6 }, makeRow))
    const [showSuccess, setShowSuccess] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const updateRow = (id, text) => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, text } : r)))
    }

    const addRow = () => {
        setRows((prev) => [...prev, makeRow()])
    }

    // A reminder needs a real medication _id to reference on the backend, so if this row
    // hasn't been saved yet, save it now before navigating to the reminder screen.
    const handleSetReminder = async (row) => {
        if (!row.text.trim()) return
        const { name, dosage, time } = parseRow(row.text)

        if (row.savedId) {
            navigation.navigate('MedicationReminder', {
                medicationId: row.savedId,
                medication: row.text,
                medicationName: name,
                medicationTime: time,
            })
            return
        }

        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, savingReminder: true } : r)))
        try {
            const created = await createMedication(buildMedicationPayload({ name, dosage, time }))
            const medicationId = created?.id || created?._id
            setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, savingReminder: false, savedId: medicationId } : r)))
            navigation.navigate('MedicationReminder', {
                medicationId,
                medication: row.text,
                medicationName: name,
                medicationTime: time,
            })
        } catch (err) {
            setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, savingReminder: false } : r)))
            console.log('createMedication (for reminder) failed:', JSON.stringify(err))
            Alert.alert('Could not save medication', extractErrorMessage(err))
        }
    }

    const handleSave = async () => {
        const filled = rows.filter((r) => r.text.trim())
        if (filled.length === 0) return

        // Rows already saved via the "set reminder" button shouldn't be created again.
        const toCreate = filled.filter((r) => !r.savedId)

        if (toCreate.length === 0) {
            setShowSuccess(true)
            return
        }

        setIsSaving(true)

        const results = await Promise.allSettled(
            toCreate.map((row) => buildMedicationPayload(parseRow(row.text))).map(createMedication)
        )

        setIsSaving(false)

        const failures = results
            .map((r, i) => ({ r, row: toCreate[i] }))
            .filter(({ r }) => r.status === 'rejected')

        if (failures.length > 0) {
            const messages = failures.map(({ r, row }) => {
                const err = r.reason
                console.log('createMedication failed:', JSON.stringify(err))
                return `"${row.text}": ${extractErrorMessage(err)}`
            })
            Alert.alert(
                failures.length === toCreate.length ? 'Save failed' : 'Some medications failed to save',
                messages.join('\n')
            )
        }

        const succeededCount = (filled.length - toCreate.length) + (results.length - failures.length)
        if (succeededCount > 0) {
            setShowSuccess(true)
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Input Medications</Text>
                </View>

                <View style={styles.subHeaderRow}>
                    <Text style={styles.subTitle}>Enter Medication Details</Text>
                    <Text style={styles.reminderLabel}>Set{'\n'}reminder</Text>
                </View>

                <View style={styles.rows}>
                    {rows.map((row) => (
                        <View key={row.id} style={styles.row}>
                            <TouchableOpacity onPress={addRow} style={styles.plusBtn}>
                                <Text style={styles.plusText}>+</Text>
                            </TouchableOpacity>

                            <TextInput
                                style={styles.rowInput}
                                placeholder="Medication Name, Dosage,Time"
                                placeholderTextColor="#9B9ECC"
                                value={row.text}
                                onChangeText={(text) => updateRow(row.id, text)}
                            />

                            <TouchableOpacity onPress={() => handleSetReminder(row)} style={styles.reminderBtn} disabled={row.savingReminder}>
                                {row.savingReminder ? (
                                    <ActivityIndicator size="small" color={PRIMARY} />
                                ) : (
                                    <>
                                        <Text style={styles.reminderIcon}>⏰</Text>
                                        <Text style={styles.reminderPlus}>+</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                        {isSaving ? <ActivityIndicator color="#3D3F8F" /> : <Text style={styles.saveBtnText}>Save</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <SuccessModal
                visible={showSuccess}
                title="Medication Saved Successfully"
                onReturnHome={() => { setShowSuccess(false); navigation.navigate('Home') }}
                onClose={() => setShowSuccess(false)}
            />
        </SafeAreaView>
    )
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -40, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E4E4F2', zIndex: 0 },
    circleBottomLeft: { position: 'absolute', bottom: -60, left: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: '#E4E4F2', zIndex: 0 },
    scroll: { flexGrow: 1, zIndex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, gap: 16 },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    subHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },
    subTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', flexShrink: 1 },
    reminderLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' },
    rows: { paddingHorizontal: 20, gap: 18 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    plusBtn: { width: 28, alignItems: 'center' },
    plusText: { fontSize: 24, color: PRIMARY, fontWeight: '300' },
    rowInput: { flex: 1, height: 52, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 26, paddingHorizontal: 18, fontSize: 15, color: PRIMARY },
    reminderBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: PRIMARY, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
    reminderIcon: { fontSize: 14 },
    reminderPlus: { position: 'absolute', bottom: -2, right: 0, fontSize: 12, color: PRIMARY, fontWeight: 'bold' },
    bottom: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },
    saveBtn: { width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    saveBtnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
