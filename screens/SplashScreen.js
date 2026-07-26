import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useAuth } from '../context/AuthContext'

const videoSource = require('../assets/splash-animation.mp4')

export default function SplashScreen({ navigation }) {
    const { user, isLoading } = useAuth()
    const hasNavigated = useRef(false)

    const player = useVideoPlayer(videoSource, (p) => {
        p.loop = false
        p.play()
    })

    const goNext = () => {
        if (hasNavigated.current) return
        // If the /auth/me session check is still running, wait a bit and try again
        // rather than flashing the Welcome screen before we know the real state.
        if (isLoading) {
            setTimeout(goNext, 150)
            return
        }
        hasNavigated.current = true
        navigation.replace(user ? 'Home' : 'Welcome')
    }

    useEffect(() => {
        const subscription = player.addListener('playToEnd', goNext)
        return () => subscription.remove()
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
