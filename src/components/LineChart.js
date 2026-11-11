import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Simple line chart built only from Views, so no extra native libraries are needed.
// `data` is an array of percentages (0-100) in chronological order.
export default function LineChart({ data, height = 190 }) {
  const [width, setWidth] = useState(0);
  const padL = 34;
  const padR = 14;
  const padT = 14;
  const padB = 14;
  const innerW = Math.max(width - padL - padR, 1);
  const innerH = height - padT - padB;

  const points = data.map((v, i) => ({
    x: padL + (data.length === 1 ? innerW / 2 : (i * innerW) / (data.length - 1)),
    y: padT + innerH - (Math.max(0, Math.min(100, v)) / 100) * innerH,
    v,
  }));

  return (
    <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {[0, 50, 100].map((g) => {
        const y = padT + innerH - (g / 100) * innerH;
        return (
          <View key={g}>
            <Text style={[styles.axis, { top: y - 8 }]}>{g}</Text>
            <View style={[styles.grid, { top: y, left: padL, right: padR }]} />
          </View>
        );
      })}

      {width > 0 &&
        points.slice(1).map((p, i) => {
          const a = points[i];
          const dx = p.x - a.x;
          const dy = p.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={`s${i}`}
              style={{
                position: 'absolute',
                left: (a.x + p.x) / 2 - len / 2,
                top: (a.y + p.y) / 2 - 1.5,
                width: len,
                height: 3,
                borderRadius: 2,
                backgroundColor: colors.primary,
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          );
        })}

      {width > 0 &&
        points.map((p, i) => (
          <View
            key={`d${i}`}
            style={[styles.dot, { left: p.x - 6, top: p.y - 6 }]}
          />
        ))}

      {width > 0 &&
        points.length > 0 && (
          <Text style={[styles.last, { left: Math.min(points[points.length - 1].x - 14, width - 40), top: Math.max(points[points.length - 1].y - 26, 0) }]}>
            {points[points.length - 1].v}%
          </Text>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  axis: { position: 'absolute', left: 0, fontSize: 11, color: colors.muted, fontWeight: '700' },
  grid: { position: 'absolute', height: 1, backgroundColor: colors.line },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  last: { position: 'absolute', fontSize: 12, fontWeight: '900', color: colors.primary },
});
