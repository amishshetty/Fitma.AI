import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressDots({ total = 5, current = 0 }: { total?: number; current?: number }) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: index === current ? 22 : 7,
              backgroundColor: index === current ? '#34C759' : '#cfebd8',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
