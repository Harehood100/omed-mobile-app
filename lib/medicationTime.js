// Parses common time formats a person might type — "3pm", "8:00am", "15:00", "8:30 PM" —
// into a 24-hour { hours, minutes } object. Returns null if it can't confidently parse.
export function parseTimeString(raw) {
    if (!raw) return null
    const cleaned = raw.trim().toLowerCase()

    const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/)
    if (!match) return null

    let hours = parseInt(match[1], 10)
    const minutes = match[2] ? parseInt(match[2], 10) : 0
    const meridiem = match[3]

    if (hours > 23 || minutes > 59) return null

    if (meridiem === 'pm' && hours < 12) hours += 12
    if (meridiem === 'am' && hours === 12) hours = 0

    return { hours, minutes }
}

// "HH:mm" 24-hour string, as the backend expects for reminderTime entries.
export function toHHMM({ hours, minutes }) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// "08:00" -> "8:00 AM" — for friendly display of times that came back from the API.
export function formatHHMM(hhmm) {
    if (!hhmm) return ''
    const [h, m] = hhmm.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return hhmm
    const period = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
