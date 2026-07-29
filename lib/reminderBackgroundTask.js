import * as TaskManager from 'expo-task-manager'
import * as BackgroundTask from 'expo-background-task'
import { getReminders, triggerReminder } from '../api/reminders'

// Local notifications can't wake a fully-killed app to run JS the way a remote push can
// (that's what expo-notifications' own registerTaskAsync is actually for — it only fires for
// headless remote notifications). So for a killed app, the best we can do is catch up
// afterwards: periodically ask the backend which PENDING reminders are already past their
// scheduledAt time, and mark them TRIGGERED. The OS reliably displays the local notification
// on schedule regardless — this task just makes sure the backend eventually finds out.
export const REMINDER_SYNC_TASK = 'omed-reminder-sync'

// Must be defined at module scope (not inside a component) — this file is imported at the
// very top of index.js so the task is registered before anything else runs, including on a
// headless background relaunch.
TaskManager.defineTask(REMINDER_SYNC_TASK, async () => {
    try {
        const { reminders } = await getReminders({ page: 1, limit: 50 })
        const now = Date.now()
        const overdue = (reminders || []).filter(
            (r) => r.status === 'PENDING' && r.scheduledAt && new Date(r.scheduledAt).getTime() <= now
        )

        if (overdue.length === 0) return BackgroundTask.BackgroundTaskResult.Success

        await Promise.allSettled(overdue.map((r) => triggerReminder(r._id || r.id)))
        return BackgroundTask.BackgroundTaskResult.Success
    } catch (err) {
        // Not signed in yet, offline, etc. — nothing to reconcile right now, the task will
        // just get another chance at the next interval.
        console.log('reminder sync task failed:', JSON.stringify(err))
        return BackgroundTask.BackgroundTaskResult.Failed
    }
})

// Safe to call every app launch — re-registering an already-registered task is a no-op.
// Android enforces a 15 minute minimum; iOS treats this as a hint and decides the actual
// timing itself.
export async function registerReminderSyncTask() {
    return BackgroundTask.registerTaskAsync(REMINDER_SYNC_TASK, { minimumInterval: 15 })
}

export async function unregisterReminderSyncTask() {
    return BackgroundTask.unregisterTaskAsync(REMINDER_SYNC_TASK)
}
