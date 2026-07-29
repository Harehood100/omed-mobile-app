import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useAuth } from '../context/AuthContext'

const videoSource = require('../assets/splash-animation.mp4')

// One loop of the animation, in ms (37 frames at 15fps) — the minimum time the brand
// plays before we're willing to navigate away, even if the session check finishes sooner.
const MIN_PLAY_MS = 2700
// If we're still waiting past this, something's slow (bad network, etc.) — show a subtle
// hint so a looping video doesn't read as stuck. The video keeps looping either way; see
// below for why we loop instead of freezing on the last frame.
const SLOW_HINT_MS = 4500
// Absolute ceiling so a session check that never resolves can never strand the user here.
const ABSOLUTE_MAX_MS = 12000

export default function SplashScreen({ navigation }) {
    const { user, isLoading, lastKnownUser } = useAuth()
    const hasNavigated = useRef(false)
    const [showSlowHint, setShowSlowHint] = useState(false)

    // Refs always hold the latest auth values so the timers below (registered once on
    // mount) never read a stale closure.
    const userRef = useRef(user)
    const isLoadingRef = useRef(isLoading)
    const lastKnownUserRef = useRef(lastKnownUser)
    useEffect(() => {
        userRef.current = user
        isLoadingRef.current = isLoading
        lastKnownUserRef.current = lastKnownUser
    }, [user, isLoading, lastKnownUser])

    // Looping instead of stopping dead on a single frame — this clip happens to end on a
    // solid purple frame, which reads as a blank/broken page if the auth check takes any
    // extra time to resolve after the animation finishes.
    const player = useVideoPlayer(videoSource, (p) => {
        p.loop = true
        p.play()
    })

    useEffect(() => {
        let cancelled = false
        const startedAt = Date.now()

        const goNext = () => {
            if (hasNavigated.current || cancelled) return
            hasNavigated.current = true
            if (userRef.current) {
                navigation.replace('Home')
            } else if (lastKnownUserRef.current) {
                navigation.replace('WelcomeBack')
            } else {
                navigation.replace('Welcome')
            }
        }

        const tryNavigate = () => {
            if (cancelled) return
            const elapsed = Date.now() - startedAt
            if (isLoadingRef.current && elapsed < ABSOLUTE_MAX_MS) {
                setTimeout(tryNavigate, 150)
                return
            }
            goNext()
        }

        const minPlayTimer = setTimeout(tryNavigate, MIN_PLAY_MS)
        const slowHintTimer = setTimeout(() => setShowSlowHint(true), SLOW_HINT_MS)

        return () => {
            cancelled = true
            clearTimeout(minPlayTimer)
            clearTimeout(slowHintTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <View style={styles.container}>
            <VideoView
                style={styles.video}
                player={player}
                contentFit="cover"
                nativeControls={false}
            />
            {showSlowHint && (
                <View style={styles.hintWrap}>
                    <Text style={styles.hintText}>Still loading…</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    video: { flex: 1, width: '100%', height: '100%' },
    hintWrap: { position: 'absolute', bottom: 48, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
    hintText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
})
