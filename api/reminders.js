import client from './client'

// type: 'Medication' | 'Appointment', referenceId: the medication/appointment _id this
// reminder belongs to. scheduledAt is when the local notification is due to fire.
export const createReminder = async ({ type, referenceId, title, message, scheduledAt, repeat = 'NONE', enabled = true }) => {
    const { data } = await client.post('/reminders', {
        type, referenceId, title, message, scheduledAt, repeat, enabled,
    })
    return data.data
}

export const getReminders = async ({ page = 1, limit = 20 } = {}) => {
    const { data } = await client.get('/reminders', { params: { page, limit } })
    return data.data
}

export const getReminder = async (reminderId) => {
    const { data } = await client.get(`/reminders/${reminderId}`)
    return data.data
}

export const updateReminder = async (reminderId, updates) => {
    const { data } = await client.patch(`/reminders/${reminderId}`, updates)
    return data.data
}

export const deleteReminder = async (reminderId) => {
    const { data } = await client.delete(`/reminders/${reminderId}`)
    return data.data
}

// Called once the local notification has actually been displayed on-device — lets the
// backend flip PENDING -> TRIGGERED and track reminder history. See
// lib/localNotifications.js#registerReminderTriggerListener for where this gets called from.
export const triggerReminder = async (reminderId, triggeredAt = new Date().toISOString()) => {
    const { data } = await client.post(`/reminders/${reminderId}/trigger`, { triggeredAt })
    return data
}

export const markReminderTaken = (reminderId) => updateReminder(reminderId, { status: 'TAKEN' })
export const markReminderSkipped = (reminderId) => updateReminder(reminderId, { status: 'SKIPPED' })
