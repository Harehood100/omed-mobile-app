import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerUser, loginUser, getCurrentUser } from '../api/auth'
import { setUnauthorizedHandler, TOKEN_KEYS } from '../api/client'

const AuthContext = createContext(null)

// Non-sensitive — just enough to show "Welcome back, Jane" and prefill an
// email field. Never store passwords or tokens under this key.
const LAST_USER_KEY = 'healthnest_last_known_user'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [lastKnownUser, setLastKnownUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true) // true while we check for a saved session

    const logout = useCallback(async () => {
        // Intentionally keep the last-known-user record — that's what lets
        // WelcomeBackScreen greet a returning person by name after logout.
        await AsyncStorage.multiRemove([TOKEN_KEYS.access, TOKEN_KEYS.refresh])
        setUser(null)
    }, [])

    // If any request gets a 401, drop the session so the app can redirect to login.
    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null))
    }, [])

    // On app start, check for a saved token and re-fetch the user, and separately
    // load whichever non-sensitive "last known user" record exists (if any).
    useEffect(() => {
        (async () => {
            const [token, storedLastUser] = await Promise.all([
                AsyncStorage.getItem(TOKEN_KEYS.access),
                AsyncStorage.getItem(LAST_USER_KEY),
            ])

            if (storedLastUser) {
                try { setLastKnownUser(JSON.parse(storedLastUser)) } catch { /* ignore corrupt value */ }
            }

            if (token) {
                try {
                    const me = await getCurrentUser()
                    setUser(me)
                } catch {
                    await AsyncStorage.multiRemove([TOKEN_KEYS.access, TOKEN_KEYS.refresh])
                }
            }
            setIsLoading(false)
        })()
    }, [])

    const register = useCallback(async ({ firstName, lastName, email, password }) => {
        return registerUser({ firstName, lastName, email, password })
        // Registration only creates the account — HealthNest doesn't return tokens here,
        // so callers should follow up with login().
    }, [])

    const login = useCallback(async ({ email, password }) => {
        const result = await loginUser({ email, password })
        const { user: loggedInUser, tokens } = result
        const accessToken = tokens?.accessToken
        const refreshToken = tokens?.refreshToken

        if (!accessToken) {
            console.log('Unexpected login response shape:', JSON.stringify(result))
            throw { message: 'Login succeeded but no access token was returned. Check the console log for the raw response.' }
        }

        await AsyncStorage.setItem(TOKEN_KEYS.access, accessToken)
        if (refreshToken) await AsyncStorage.setItem(TOKEN_KEYS.refresh, refreshToken)

        const lastUserRecord = { firstName: loggedInUser.firstName, email: loggedInUser.email }
        await AsyncStorage.setItem(LAST_USER_KEY, JSON.stringify(lastUserRecord))
        setLastKnownUser(lastUserRecord)

        setUser(loggedInUser)
        return loggedInUser
    }, [])

    // Lets "Not you? Switch account" clear the remembered record so the next
    // launch/logout goes to the full Welcome screen instead of WelcomeBack.
    const forgetLastKnownUser = useCallback(async () => {
        await AsyncStorage.removeItem(LAST_USER_KEY)
        setLastKnownUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, lastKnownUser, register, login, logout, forgetLastKnownUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
