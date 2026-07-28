import { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { getMedications, deleteMedication } from '../api/medications'
import { formatHHMM } from '../lib/medicationTime'
import { extractErrorMessage } from '../lib/errorMessage'

function formatDateRange(startDate, endDate) {
    if (!startDate) return ''
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!endDate) return `From ${start}`
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${start} - ${end}`
}

function MedicationCard({ medication, onDelete }) {
    const times = Array.isArray(medication.reminderTime) ? medication.reminderTime : []

    return (
        <View style={styles.card}>
            {medication.status ? (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{medication.status}</Text>
                </View>
            ) : null}

            <Text style={styles.name}>{medication.name}</Text>
            {medication.dosage ? <Text style={styles.dosage}>{medication.dosage}</Text> : null}
            {medication.frequency ? <Text style={styles.meta}>{medication.frequency}</Text> : null}

            {times.length > 0 && (
                <Text style={styles.meta}>{times.map(formatHHMM).join(', ')}</Text>
            )}

            {(medication.startDate || medication.endDate) && (
                <Text style={styles.meta}>{formatDateRange(medication.startDate, medication.endDate)}</Text>
            )}

            {medication.instructions ? <Text style={styles.instructions}>{medication.instructions}</Text> : null}

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDelete(medication.id || medication._id, medication.name)}
            >
                <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function MedicationsScreen({ navigation }) {
    const [medications, setMedications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [loadError, setLoadError] = useState(null)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

    const loadMedications = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setIsLoading(true)
        setLoadError(null)
        try {
            const data = await getMedications()
            setMedications(Array.isArray(data) ? data : data?.medications || [])
        } catch (err) {
            setLoadError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
            setHasLoadedOnce(true)
        }
    }, [])

    // Refetch every time this screen becomes focused — covers coming back from
    // Input Medications after adding a new one, without needing special params.
    useFocusEffect(
        useCallback(() => {
            loadMedications({ silent: hasLoadedOnce })
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [loadMedications])
    )

    const handleDelete = (id, name) => {
        if (!id) return
        Alert.alert('Delete medication', `Remove ${name || 'this medication'}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteMedication(id)
                        loadMedications({ silent: true })
                    } catch (err) {
                        Alert.alert('Could not delete', extractErrorMessage(err))
                    }
                },
            },
        ])
    }

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); loadMedications({ silent: true }) }} />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>My Medications</Text>
                </View>

                <View style={styles.introCard}>
                    <Text style={styles.introText}>Keep track of everything you're taking.</Text>
                    <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('InputMedications')}>
                        <Text style={styles.createBtnText}>Add New Medication</Text>
                    </TouchableOpacity>
                </View>

                {isLoading && (
                    <View style={styles.centerBox}>
                        <ActivityIndicator color="#3D3F8F" />
                    </View>
                )}

                {!isLoading && loadError && (
                    <View style={styles.centerBox}>
                        <Text style={styles.errorText}>{loadError}</Text>
                        <TouchableOpacity onPress={() => loadMedications()}>
                            <Text style={styles.retryText}>Tap to retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!isLoading && !loadError && medications.length === 0 && (
                    <View style={styles.centerBox}>
                        <Text style={styles.emptyText}>No medications yet. Add one above.</Text>
                    </View>
                )}

                {!isLoading && !loadError && medications.map((m) => (
                    <MedicationCard key={m.id || m._id} medication={m} onDelete={handleDelete} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 20, gap: 16 },
    backBtn: { padding: 4 },
    backArrow: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    introCard: { backgroundColor: '#2D3178', borderRadius: 20, padding: 20, gap: 20 },
    introText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', lineHeight: 24 },
    createBtn: { backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
    createBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },
    card: { backgroundColor: '#2D3178', borderRadius: 20, padding: 20 },
    badge: { position: 'absolute', top: 16, right: 0, backgroundColor: '#F5D76E', paddingVertical: 6, paddingHorizontal: 16, borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
    badgeText: { color: '#5C4400', fontSize: 13, fontWeight: '700' },
    name: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    dosage: { color: '#D8DAEC', fontSize: 15, marginTop: 2 },
    meta: { color: '#D8DAEC', fontSize: 14, marginTop: 6 },
    instructions: { color: '#B7BAE0', fontSize: 13, marginTop: 8, fontStyle: 'italic' },
    deleteBtn: { alignSelf: 'flex-start', marginTop: 14 },
    deleteBtnText: { color: '#F0A5A5', fontSize: 14, fontWeight: '600' },
    centerBox: { alignItems: 'center', paddingVertical: 24, gap: 10 },
    errorText: { color: '#B3261E', fontSize: 15, textAlign: 'center' },
    retryText: { color: '#3D3F8F', fontSize: 15, fontWeight: '600' },
    emptyText: { color: '#6B6E9E', fontSize: 15, textAlign: 'center' },
})
