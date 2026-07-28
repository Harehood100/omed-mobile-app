import { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Swap this for a real crash-reporting service (e.g. Sentry) once one is set up.
        console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false })
    }

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaView style={styles.screen}>
                    <View style={styles.circleTopRight} />
                    <View style={styles.circleBottomLeft} />

                    <View style={styles.content}>
                        <Text style={styles.icon}>⚠️</Text>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.message}>
                            An unexpected error occurred. You can try again below — if the
                            problem keeps happening, please restart the app.
                        </Text>
                        <TouchableOpacity style={styles.btn} onPress={this.handleRetry}>
                            <Text style={styles.btnText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )
        }

        return this.props.children
    }
}

const PRIMARY = '#3D3F8F'

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    circleTopRight: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#E8EAF0' },
    circleBottomLeft: { position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: '#E8EAF0' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 16 },
    icon: { fontSize: 48 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center' },
    message: { fontSize: 15, color: '#4A4A4A', textAlign: 'center', lineHeight: 22 },
    btn: { marginTop: 12, width: '100%', height: 56, borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    btnText: { fontSize: 18, color: PRIMARY, fontWeight: '600' },
})
