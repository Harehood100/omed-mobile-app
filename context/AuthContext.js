import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerUser, loginUser, getCurrentUser } from '../api/auth'
import { setUnauthorizedHandler, TOKEN_KEYS } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true) // true while we check for a saved session

    const logout = useCallback(async () => {
        await AsyncStorage.multiRemove([TOKEN_KEYS.access, TOKEN_KEYS.refresh])
        setUser(null)
    }, [])

    // If any request gets a 401, drop the session so the app can redirect to login.
    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null))
    }, [])

    // On app start, check for a saved token and re-fetch the user.
    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem(TOKEN_KEYS.access)
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
        setUser(loggedInUser)
        return loggedInUser
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
