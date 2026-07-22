import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'

const carouselItems = [
    { text: 'We Help You Keep Track Of Your Medication', emoji: '💊' },
    { text: 'Remind You About Your Appointments', emoji: '📅' },
    { text: 'Connect With Your Care Circle', emoji: '👩‍👧' },
]

export default function HomeScreen({ navigation }) {
    const [carouselIndex, setCarouselIndex] = useState(0)

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.bigCircle} />
                    <View style={styles.smallCircle} />
                    <View style={styles.medCircle} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Welcome to OMED</Text>
                        <View style={styles.heroPill}>
                            <Text style={styles.heroPillText}>Helping you keep it together</Text>
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { }} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>💊</Text></View>
                        <Text style={styles.menuLabel}>Input Medications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Appointments')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>📅</Text></View>
                        <Text style={styles.menuLabel}>Set Appointments</Text>
                    </TouchableOpacity>

                    {/* Carousel */}
                    <View style={styles.carousel}>
                        <View style={styles.carouselInner}>
                            <Text style={styles.carouselText}>{carouselItems[carouselIndex].text}</Text>
                            <Text style={styles.carouselEmoji}>{carouselItems[carouselIndex].emoji}</Text>
                        </View>
                        <View style={styles.dots}>
                            {carouselItems.map((_, i) => (
                                <TouchableOpacity key={i} onPress={() => setCarouselIndex(i)} style={[styles.dot, i === carouselIndex && styles.dotActive]} />
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={() => { }} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>👤</Text></View>
                        <Text style={styles.menuLabel}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AddCaregiver')} activeOpacity={0.8}>
                        <View style={styles.iconWrap}><Text style={styles.iconText}>👨‍👩‍👧</Text></View>
                        <Text style={styles.menuLabel}>Add my caregiver / child</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <View style={styles.homeBtn}><Text style={styles.homeIcon}>🏠</Text></View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#E8EAF0' },
    hero: { height: 200, backgroundColor: '#8B8FBF', overflow: 'hidden', position: 'relative' },
    bigCircle: { position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#2D3178' },
    smallCircle: { position: 'absolute', top: 20, right: 100, width: 52, height: 52, borderRadius: 26, backgroundColor: '#2D3178', opacity: 0.8 },
    medCircle: { position: 'absolute', top: 90, left: 120, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.15)' },
    heroContent: { position: 'absolute', bottom: 24, left: 20 },
    heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    heroPill: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
    heroPillText: { color: '#1A1A1A', fontSize: 13 },
    menu: { padding: 16, gap: 12 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8EAF0', borderRadius: 30, padding: 14, gap: 14, borderWidth: 1, borderColor: '#D0D3E8' },
    iconWrap: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#3D3F8F', justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 20 },
    menuLabel: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
    carousel: { borderWidth: 1.5, borderColor: '#2D3178', borderRadius: 16, padding: 16, backgroundColor: '#E8EAF0' },
    carouselInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    carouselText: { fontSize: 16, fontWeight: 'bold', color: '#2D3178', flex: 1, paddingRight: 10 },
    carouselEmoji: { fontSize: 40 },
    dots: { flexDirection: 'row', gap: 8 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C4C4C4' },
    dotActive: { backgroundColor: '#2D3178' },
    bottomNav: { backgroundColor: '#E8EAF0', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#D0D3E8' },
    homeBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
    homeIcon: { fontSize: 24 },
})
