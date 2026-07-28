import { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { getDashboard } from '../api/dashboard'
import { markReminderTaken, markReminderSkipped } from '../api/reminders'
import { extractErrorMessage } from '../lib/errorMessage'
import { formatReminderTime } from '../lib/medicationTime'
import ReminderCard from '../components/ReminderCard'

const carouselItems = [
    { text: 'We Help You Keep Track Of Your Medication', emoji: '💊' },
    { text: 'Remind You About Your Appointments', emoji: '📅' },
    { text: 'Connect With Your Care Circle', emoji: '👩‍👧' },
]

function formatAppointmentDate(dateStr, timeStr) {
    if (!dateStr) return timeStr || ''
    const label = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    return timeStr ? `${label} . ${timeStr}` : label
}

function SummaryCard({ label, value }) {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{value}</Text>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    )
}

export default function HomeScreen({ navigation }) {
    const [carouselIndex, setCarouselIndex] = useState(0)
    const [dashboard, setDashboard] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [loadError, setLoadError] = useState(null)
    const [busyReminderId, setBusyReminderId] = useState(null)

    const loadDashboard = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setIsLoading(true)
        setLoadError(null)
        try {
            const data = await getDashboard()
            setDashboard(data)
        } catch (err) {
            console.log('getDashboard failed:', JSON.stringify(err))
            setLoadError(extractErrorMessage(err))
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadDashboard({ silent: true })
        }, [loadDashboard])
    )

    const onRefresh = () => {
        setIsRefreshing(true)
        loadDashboard({ silent: true })
    }

    const updateReminderInList = (reminderId, updates) => {
        setDashboard((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                todayReminderList: (prev.todayReminderList || []).map((r) =>
                    (r._id || r.id) === reminderId ? { ...r, ...updates } : r
                ),
            }
        })
    }

    const handleTaken = async (reminder) => {
        const reminderId = reminder._id || reminder.id
        const previousStatus = reminder.status
        setBusyReminderId(reminderId)
        updateReminderInList(reminderId, { status: 'TAKEN' })
        try {
            await markReminderTaken(reminderId)
        } catch (err) {
            console.log('markReminderTaken failed:', JSON.stringify(err))
            updateReminderInList(reminderId, { status: previousStatus })
            Alert.alert('Could not update reminder', extractErrorMessage(err))
        } finally {
            setBusyReminderId(null)
        }
    }

    const handleSkipped = async (reminder) => {
        const reminderId = reminder._id || reminder.id
        const previousStatus = reminder.status
        setBusyReminderId(reminderId)
        updateReminderInList(reminderId, { status: 'SKIPPED' })
        try {
            await markReminderSkipped(reminderId)
        } catch (err) {
            console.log('markReminderSkipped failed:', JSON.stringify(err))
            updateReminderInList(reminderId, { status: previousStatus })
            Alert.alert('Could not update reminder', extractErrorMessage(err))
        } finally {
            setBusyReminderId(null)
        }
    }

    const summary = dashboard?.summary || {}
    const todayReminderList = dashboard?.todayReminderList || []
    const upcomingAppointment = dashboard?.upcomingAppointment
    const recentActivities = dashboard?.recentActivities || []

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.bigCircle} />
                    <View style={styles.smallCircle} />
                    <View style={styles.medCircle} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Welcome to OMED</Text>
                        <View style={styles.heroPill}>
                            <Text style={styles.heroPillText}>Helping you keep it together</Text>
                        </View>
                    </View>
                </View>

                {/* Dashboard */}
                <View style={styles.dashboard}>
                    {isLoading ? (
                        <ActivityIndicator color="#2D3178" style={{ marginVertical: 20 }} />
                    ) : loadError ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{loadError}</Text>
                            <TouchableOpacity onPress={() => loadDashboard()}>
                                <Text style={styles.retryText}>Tap to retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <View style={styles.summaryGrid}>
                                <SummaryCard label="Active Medications" value={summary.activeMedications ?? 0} />
                                <SummaryCard label="Today's Reminders" value={summary.todayReminders ?? 0} />
                                <SummaryCard label="Today's Appointments" value={summary.todayAppointments ?? 0} />
                                <SummaryCard label="Missed Reminders" value={summary.missedReminders ?? 0} />
                            </View>

                            <Text style={styles.sectionTitle}>Today's Reminders</Text>
                            {todayReminderList.length === 0 ? (
                                <Text style={styles.emptyText}>No reminders for today.</Text>
                            ) : (
                                <View style={styles.cardList}>
                                    {todayReminderList.map((reminder) => (
                                        <ReminderCard
                                            key={reminder._id || reminder.id}
                                            reminder={reminder}
                                            onTaken={handleTaken}
                                            onSkipped={handleSkipped}
                                            busy={busyReminderId === (reminder._id || reminder.id)}
                                        />
                                    ))}
                                </View>
                            )}

                            {upcomingAppointment && (
                                <>
                                    <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
                                    <View style={styles.appointmentCard}>
                                        <Text style={styles.appointmentDoctor}>{upcomingAppointment.doctorName}</Text>
                                        {upcomingAppointment.doctorSpecialty ? (
                                            <Text style={styles.appointmentMeta}>{upcomingAppointment.doctorSpecialty}</Text>
                                        ) : null}
                                        {upcomingAppointment.hospitalName ? (
                                            <Text style={styles.appointmentMeta}>{upcomingAppointment.hospitalName}</Text>
                                        ) : null}
                                        <Text style={styles.appointmentDate}>
                                            {formatAppointmentDate(upcomingAppointment.appointmentDate, upcomingAppointment.appointmentTime)}
                                        </Text>
                                    </View>
                                </>
                            )}

                            {recentActivities.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                                    <View style={styles.cardList}>
                                        {recentActivities.map((activity) => (
                                            <View key={activity._id || activity.id} style={styles.activityRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.activityTitle}>{activity.title}</Text>
                                                    <Text style={styles.activityMeta}>{formatReminderTime(activity.scheduledAt)}</Text>
                                                </View>
                                                <Text style={styles.activityStatus}>{activity.status}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </View>

                {/* Menu */}
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Medications')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>💊</Text></View>
                        <Text style={styles.menuLabel}>Input Medications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Appointments')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>📅</Text></View>
                        <Text style={styles.menuLabel}>Set Appointments</Text>
                    </TouchableOpacity>

                    {/* Carousel */}
                    <View style={styles.carousel}>
                        <View style={styles.carouselInner}>
                            <Text style={styles.carouselText}>{carouselItems[carouselIndex].text}</Text>
                            <Text style={styles.carouselEmoji}>{carouselItems[carouselIndex].emoji}</Text>
                        </View>
                        <View style={styles.dots}>
                            {carouselItems.map((_, i) => (
                                <TouchableOpacity key={i} onPress={() => setCarouselIndex(i)} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>👤</Text></View>
                        <Text style={styles.menuLabel}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddCaregiver')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>👨‍👩‍👧</Text></View>
                        <Text style={styles.menuLabel}>Add my caregiver / child</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <View style={styles.homeBtn}><Text style={styles.homeIcon}>🏠</Text></View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#E8EAF0' },
    hero: { height: 200, backgroundColor: '#8B8FBF', overflow: 'hidden', position: 'relative' },
    bigCircle: { position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#2D3178' },
    smallCircle: { position: 'absolute', top: 20, right: 100, width: 52, height: 52, borderRadius: 26, backgroundColor: '#2D3178', opacity: 0.8 },
    medCircle: { position: 'absolute', top: 90, left: 120, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.15)' },
    heroContent: { position: 'absolute', bottom: 24, left: 20 },
    heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    heroPill: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
    heroPillText: { color: '#1A1A1A', fontSize: 13 },

    dashboard: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
    errorBox: { alignItems: 'center', gap: 8, paddingVertical: 16 },
    errorText: { color: '#D64545', fontSize: 14, textAlign: 'center' },
    retryText: { color: '#2D3178', fontSize: 14, fontWeight: '700' },
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    summaryCard: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: '#D0D3E8' },
    summaryValue: { fontSize: 26, fontWeight: 'bold', color: '#2D3178' },
    summaryLabel: { fontSize: 12, color: '#5A5C8C', marginTop: 4, textAlign: 'center', paddingHorizontal: 8 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', marginTop: 8 },
    emptyText: { fontSize: 14, color: '#8285B0' },
    cardList: { gap: 10 },
    appointmentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 4, borderWidth: 1, borderColor: '#D0D3E8' },
    appointmentDoctor: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    appointmentMeta: { fontSize: 13, color: '#5A5C8C' },
    appointmentDate: { fontSize: 13, fontWeight: '600', color: '#2D3178', marginTop: 4 },
    activityRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E4E4F2' },
    activityTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
    activityMeta: { fontSize: 12, color: '#8285B0', marginTop: 2 },
    activityStatus: { fontSize: 11, fontWeight: '700', color: '#2D3178' },

    menu: { padding: 16, gap: 12 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8EAF0', borderRadius: 30, padding: 14, gap: 14, borderWidth: 1, borderColor: '#D0D3E8' },
    iconWrap: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 20 },
    menuLabel: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
    carousel: { borderWidth: 1.5, borderColor: '#2D3178', borderRadius: 16, padding: 16, backgroundColor: '#E8EAF0' },
    carouselInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    carouselText: { fontSize: 16, fontWeight: 'bold', color: '#2D3178', flex: 1, paddingRight: 10 },
    carouselEmoji: { fontSize: 40 },
    dots: { flexDirection: 'row', gap: 8 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C4C4C4' },
    dotActive: { backgroundColor: '#2D3178' },
    bottomNav: { backgroundColor: '#E8EAF0', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#D0D3E8' },
    homeBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
    homeIcon: { fontSize: 24 },
})
