import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import LivaAvatar from '../components/layout/LivaAvatar';
import PrimaryButton from '../components/ui/PrimaryButton';
import ProgressRing from '../components/ui/ProgressRing';
import ScreenShell from '../components/layout/ScreenShell';

const Text = (props: any) => (
  <RNText 
    {...props} 
    style={[{ fontFamily: 'sans-serif', includeFontPadding: false }, props.style]} 
    allowFontScaling={false}
  />
);

const SimpleSlider = ({ value, onValueChange, min, max, step }: any) => {
  const [width, setWidth] = useState(1);
  const handleMove = (e: any) => {
    const locX = e.nativeEvent.locationX;
    let pct = locX / width;
    pct = Math.max(0, Math.min(1, pct));
    const val = min + pct * (max - min);
    const rounded = Math.round(val / step) * step;
    onValueChange(rounded);
  };
  return (
    <View 
      style={styles.sliderContainer} 
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleMove}
      onResponderMove={handleMove}
    >
      <View style={styles.sliderTrack} />
      <View style={[styles.sliderFill, { width: `${((value - min) / (max - min)) * 100}%` }]} />
      <View style={[styles.sliderThumb, { left: `${((value - min) / (max - min)) * 100}%` }]} />
    </View>
  );
};

export default function LivaResponseScreen() {
  const router = useRouter();
  const [dinnerCals, setDinnerCals] = useState(600);

  const dailyTarget = 2450;
  const loggedSoFar = 980;
  const finalCalorieBalance = loggedSoFar + dinnerCals;
  const variance = Math.abs(finalCalorieBalance - dailyTarget);

  const forecastData = useMemo(() => {
    if (dinnerCals > 800) {
      return {
        mode: 'Feast Mode',
        message: `Exceeding target by ${variance} kcal. High-carb storage threshold active.`,
        weightTrend: '+0.15 kg expected tomorrow',
        color: '#d4183d',
      };
    } else if (dinnerCals < 450) {
      return {
        mode: 'Lean Budget',
        message: `Finishing ${variance} kcal under target. Ketosis conversion accelerated.`,
        weightTrend: '-0.22 kg expected tomorrow',
        color: '#00c4b0',
      };
    } else {
      return {
        mode: 'Standard Balanced',
        message: `Steady energy zone. Balanced glycemic levels expected tonight.`,
        weightTrend: 'Weight trajectory: Stable',
        color: '#34c759',
      };
    }
  }, [dinnerCals, variance]);

  return (
    <View style={styles.root}>
      <ScreenShell
        title="AI Calorie Forecaster"
        subtitle="Simulate dinner sizes to see weight and energy forecasts."
        onBack={() => router.back()}
        footer={
          <PrimaryButton onPress={() => router.push('/liva-recommendations')}>
            Generate Dinner Plan ({dinnerCals} kcal)
          </PrimaryButton>
        }
      >
        <View style={styles.contentSpace}>
          {/* Interactive Calorie Gauge Card */}
          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Simulated Intake</Text>
            <View style={styles.gaugeValueContainer}>
              <Text style={styles.gaugeValueBig}>{finalCalorieBalance}</Text>
              <Text style={styles.gaugeValueSmall}> / {dailyTarget} kcal</Text>
            </View>

            <View style={styles.gaugeRow}>
              <View style={styles.gaugeRingContainer}>
                <ProgressRing
                  value={Math.min(100, Math.round((finalCalorieBalance / dailyTarget) * 100))}
                  size={72}
                  color={forecastData.color}
                  label="budget"
                />
              </View>
              <View style={styles.gaugeDetails}>
                <Text style={[styles.forecastMode, { color: forecastData.color }]}>
                  {forecastData.mode}
                </Text>
                <Text style={styles.forecastTrend}>{forecastData.weightTrend}</Text>
              </View>
            </View>
          </View>

          {/* Dynamic Range Slider Control */}
          <View style={styles.sliderCard}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderTitle}>Dinner Size Plan</Text>
              <Text style={styles.sliderValue}>{dinnerCals} kcal</Text>
            </View>
            
            <SimpleSlider
              value={dinnerCals}
              onValueChange={setDinnerCals}
              min={300}
              max={1000}
              step={50}
            />

            <View style={styles.sliderFooter}>
              <Text style={styles.sliderFooterText}>Light (300 kcal)</Text>
              <Text style={styles.sliderFooterText}>Hearty (1000 kcal)</Text>
            </View>
          </View>

          {/* Liva Forecast Commentary */}
          <View style={[styles.commentaryCard, { borderColor: `${forecastData.color}30` }]}>
            <View style={styles.commentaryRow}>
              <LivaAvatar size={38} />
              <View style={styles.commentaryTextContainer}>
                <Text style={[styles.commentaryTitle, { color: forecastData.color }]}>
                  Forecast Analytics
                </Text>
                <Text style={styles.commentaryMessage}>
                  {forecastData.message} Logging a dinner close to this budget helps maintain consistent leptin levels.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    height: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentSpace: {
    gap: 20,
  },
  gaugeCard: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 20,
    borderColor: 'rgba(52, 199, 89, 0.12)',
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: 'rgba(16, 32, 26, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  gaugeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gaugeValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gaugeValueBig: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000000',
  },
  gaugeValueSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  gaugeRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  gaugeRingContainer: {},
  gaugeDetails: {
    justifyContent: 'center',
  },
  forecastMode: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  forecastTrend: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  sliderCard: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    borderColor: 'rgba(52, 199, 89, 0.06)',
    borderWidth: 1,
    shadowColor: 'rgba(16, 32, 26, 0.03)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sliderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#34c759',
  },
  sliderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderFooterText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#f0f9f4',
    borderRadius: 4,
    width: '100%',
    position: 'absolute',
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#34c759',
    borderRadius: 4,
    position: 'absolute',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34c759',
    position: 'absolute',
    top: 5,
    marginLeft: -10,
  },
  commentaryCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#f7fffe',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  commentaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  commentaryTextContainer: {
    flex: 1,
  },
  commentaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  commentaryMessage: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
});
