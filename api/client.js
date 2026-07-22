import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Confirmed against the live Swagger UI (healthnest-juho.onrender.com/api-docs)
export const BASE_URL = 'https://healthnest-juho.onrender.com/api/v1'

export const TOKEN_KEYS = {
    access: 'healthnest_access_token',
    refresh: 'healthnest_refresh_token',
}

const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
})

// Attach the access token to every request (skip for auth endpoints that don't need it)
client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEYS.access)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 401 handler: clear stored tokens so the app can redirect to login.
// We don't force navigation here (no navigator reference at this layer) —
// AuthContext listens via `onUnauthorized` and redirects.
let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.multiRemove([TOKEN_KEYS.access, TOKEN_KEYS.refresh])
            if (onUnauthorized) onUnauthorized()
        }
        // Normalize the error so callers always get { message, errors, status }
        const status = error.response?.status
        const body = error.response?.data
        return Promise.reject({
            status,
            message: body?.message || error.message || 'Something went wrong. Please try again.',
            errors: body?.errors || null,
        })
    }
)

export default client
