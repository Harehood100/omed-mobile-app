import client from './client'

// Returns { summary, upcomingAppointment, todayReminderList, recentActivities }
export const getDashboard = async () => {
    const { data } = await client.get('/dashboard')
    return data.data
}
