import { useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../api/dashboard'
import { markReminderTaken, markReminderSkipped } from '../api/reminders'
import { extractErrorMessage } from '../lib/errorMessage'
import { formatReminderTime } from '../lib/medicationTime'
import ReminderCard from '../components/ReminderCard'

const ACTIONABLE_STATUSES = ['PENDING', 'TRIGGERED']

function greetingForNow() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
}

// "in 25 min" / "in 2h 10m" / "now" — for the featured reminder's countdown.
function formatCountdown(iso) {
    if (!iso) return ''
    const diffMs = new Date(iso).getTime() - Date.now()
    if (diffMs <= 0) return 'now'
    const mins = Math.round(diffMs / 60000)
    if (mins < 60) return `in ${mins} min`
    const hours = Math.floor(mins / 60)
    const remMins = mins % 60
    return remMins > 0 ? `in ${hours}h ${remMins}m` : `in ${hours}h`
}

function formatAppointmentDate(dateStr, timeStr) {
    if (!dateStr) return timeStr || ''
    const label = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    return timeStr ? `${label} . ${timeStr}` : label
}

function StatPill({ label, value, danger }) {
    return (
        <View style={styles.statPill}>
            <Text style={[styles.statValue, danger && styles.statValueDanger]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    )
}

export default function HomeScreen({ navigation }) {
    const { user } = useAuth()
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

    // The single most urgent actionable reminder becomes the featured card; everything
    // else (including it once it's no longer actionable) falls into the list below.
    const actionable = todayReminderList
        .filter((r) => ACTIONABLE_STATUSES.includes(r.status))
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    const featured = actionable[0] || null
    const featuredId = featured ? featured._id || featured.id : null
    const restOfList = todayReminderList.filter((r) => (r._id || r.id) !== featuredId)

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.greeting}>{greetingForNow()}{user?.firstName ? `, ${user.firstName}` : ''}</Text>

                {isLoading ? (
                    <ActivityIndicator color="#2D3178" style={{ marginVertical: 24 }} />
                ) : loadError ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{loadError}</Text>
                        <TouchableOpacity onPress={() => loadDashboard()}>
                            <Text style={styles.retryText}>Tap to retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Featured: next up */}
                        {featured ? (
                            <View style={styles.featuredCard}>
                                <Text style={styles.featuredEyebrow}>
                                    Next up . {formatReminderTime(featured.scheduledAt)} . {formatCountdown(featured.scheduledAt)}
                                </Text>
                                <Text style={styles.featuredTitle}>{featured.title}</Text>
                                {featured.message ? <Text style={styles.featuredMessage}>{featured.message}</Text> : null}
                                <View style={styles.featuredActions}>
                                    <TouchableOpacity
                                        style={[styles.featuredBtn, styles.featuredTakenBtn]}
                                        onPress={() => handleTaken(featured)}
                                        disabled={busyReminderId === featuredId}
                                    >
                                        <Text style={styles.featuredTakenBtnText}>Taken</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.featuredBtn, styles.featuredSkipBtn]}
                                        onPress={() => handleSkipped(featured)}
                                        disabled={busyReminderId === featuredId}
                                    >
                                        <Text style={styles.featuredSkipBtnText}>Skip</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyFeaturedCard}>
                                <Text style={styles.emptyFeaturedTitle}>All caught up</Text>
                                <Text style={styles.emptyFeaturedSubtitle}>No reminders waiting on you right now.</Text>
                            </View>
                        )}

                        {/* Compact stats */}
                        <View style={styles.statsRow}>
                            <StatPill label="meds today" value={summary.activeMedications ?? 0} />
                            <StatPill label="appt today" value={summary.todayAppointments ?? 0} />
                            <StatPill label="missed" value={summary.missedReminders ?? 0} danger={(summary.missedReminders ?? 0) > 0} />
                        </View>

                        {/* Upcoming appointment, compact */}
                        {upcomingAppointment && (
                            <View style={styles.apptCard}>
                                <Text style={styles.apptDoctor}>{upcomingAppointment.doctorName}</Text>
                                <Text style={styles.apptMeta}>
                                    {[upcomingAppointment.doctorSpecialty, upcomingAppointment.hospitalName].filter(Boolean).join(' . ')}
                                </Text>
                                <Text style={styles.apptDate}>
                                    {formatAppointmentDate(upcomingAppointment.appointmentDate, upcomingAppointment.appointmentTime)}
                                </Text>
                            </View>
                        )}

                        {/* Rest of today's reminders */}
                        {restOfList.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>Also today</Text>
                                <View style={styles.cardList}>
                                    {restOfList.map((reminder) => (
                                        <ReminderCard
                                            key={reminder._id || reminder.id}
                                            reminder={reminder}
                                            onTaken={handleTaken}
                                            onSkipped={handleSkipped}
                                            busy={busyReminderId === (reminder._id || reminder.id)}
                                        />
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Recent activity, condensed */}
                        {recentActivities.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>Recent activity</Text>
                                <View style={styles.cardList}>
                                    {recentActivities.slice(0, 4).map((activity) => (
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

                {/* Quick actions */}
                <Text style={styles.sectionTitle}>Quick actions</Text>
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Medications')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>💊</Text></View>
                        <Text style={styles.menuLabel}>Input Medications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Appointments')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>📅</Text></View>
                        <Text style={styles.menuLabel}>Set Appointments</Text>
                    </TouchableOpacity>

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
    scroll: { padding: 16, paddingBottom: 100 },
    greeting: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 14 },

    errorBox: { alignItems: 'center', gap: 8, paddingVertical: 16 },
    errorText: { color: '#D64545', fontSize: 14, textAlign: 'center' },
    retryText: { color: '#2D3178', fontSize: 14, fontWeight: '700' },

    featuredCard: { backgroundColor: '#2D3178', borderRadius: 20, padding: 18, gap: 6, marginBottom: 12 },
    featuredEyebrow: { fontSize: 12, fontWeight: '600', color: '#C4C4DD' },
    featuredTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    featuredMessage: { fontSize: 14, color: '#D6D7EC' },
    featuredActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
    featuredBtn: { flex: 1, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
    featuredTakenBtn: { backgroundColor: '#FFFFFF' },
    featuredTakenBtnText: { color: '#2D3178', fontSize: 15, fontWeight: '700' },
    featuredSkipBtn: { borderWidth: 1.5, borderColor: '#FFFFFF' },
    featuredSkipBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

    emptyFeaturedCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, alignItems: 'center', gap: 4, marginBottom: 12, borderWidth: 1, borderColor: '#D0D3E8' },
    emptyFeaturedTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
    emptyFeaturedSubtitle: { fontSize: 13, color: '#8285B0' },

    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    statPill: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#2D3178' },
    statValueDanger: { color: '#A32D2D' },
    statLabel: { fontSize: 10, color: '#8285B0', marginTop: 2 },

    apptCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, gap: 2, marginBottom: 16 },
    apptDoctor: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    apptMeta: { fontSize: 12, color: '#5A5C8C' },
    apptDate: { fontSize: 12, fontWeight: '600', color: '#2D3178', marginTop: 2 },

    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10, marginTop: 4 },
    cardList: { gap: 10, marginBottom: 16 },
    activityRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12 },
    activityTitle: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
    activityMeta: { fontSize: 11, color: '#8285B0', marginTop: 2 },
    activityStatus: { fontSize: 10, fontWeight: '700', color: '#2D3178' },

    menu: { gap: 10, marginBottom: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, gap: 12 },
    iconWrap: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 16 },
    menuLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },

    bottomNav: { backgroundColor: '#E8EAF0', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#D0D3E8' },
    homeBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
    homeIcon: { fontSize: 24 },
})
