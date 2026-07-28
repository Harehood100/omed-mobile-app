// Backend "errors" fields have shown up in more than one shape (arrays of
// strings, nested objects, plain strings) — this walks whatever comes back
// and always produces readable text instead of "[object Object]".
export function extractErrorMessage(err) {
    const parts = []

    const collect = (value) => {
        if (value == null) return
        if (typeof value === 'string') { parts.push(value); return }
        if (Array.isArray(value)) { value.forEach(collect); return }
        if (typeof value === 'object') { Object.values(value).forEach(collect); return }
        parts.push(String(value))
    }

    if (err?.errors) collect(err.errors)
    if (parts.length === 0 && err?.message) parts.push(err.message)
    if (parts.length === 0) parts.push('Please try again.')

    return parts.join(' ')
}
