import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useAuth } from '../context/AuthContext'

const videoSource = require('../assets/splash-animation.mp4')

// 37 frames at 15fps ≈ 2.47s. Used as a fallback in case the `playToEnd`
// event doesn't fire reliably (a known expo-video issue on some devices).
const FALLBACK_DURATION_MS = 2700

export default function SplashScreen({ navigation }) {
    const { user, isLoading, lastKnownUser } = useAuth()
    const hasNavigated = useRef(false)

    // Refs always hold the latest auth values so the video-end listener
    // (registered once on mount) never reads a stale closure.
    const userRef = useRef(user)
    const isLoadingRef = useRef(isLoading)
    const lastKnownUserRef = useRef(lastKnownUser)
    useEffect(() => {
        userRef.current = user
        isLoadingRef.current = isLoading
        lastKnownUserRef.current = lastKnownUser
    }, [user, isLoading, lastKnownUser])

    const player = useVideoPlayer(videoSource, (p) => {
        p.loop = false
        p.play()
    })

    useEffect(() => {
        const goNext = () => {
            if (hasNavigated.current) return
            if (isLoadingRef.current) {
                // Session check still running — try again shortly rather than
                // guessing where to route.
                setTimeout(goNext, 150)
                return
            }
            hasNavigated.current = true
            if (userRef.current) {
                navigation.replace('Home')
            } else if (lastKnownUserRef.current) {
                navigation.replace('WelcomeBack')
            } else {
                navigation.replace('Welcome')
            }
        }

        const subscription = player.addListener('playToEnd', goNext)
        // Safety net: don't leave the user stuck on the splash forever if the
        // playToEnd event never fires.
        const fallback = setTimeout(goNext, FALLBACK_DURATION_MS)

        return () => {
            subscription.remove()
            clearTimeout(fallback)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player])

    return (
        <View style={styles.container}>
            <VideoView
                style={styles.video}
                player={player}
                contentFit="cover"
                nativeControls={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    video: { flex: 1, width: '100%', height: '100%' },
})
