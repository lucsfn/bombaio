import { StyleSheet, View } from 'react-native';
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg';
import { Text } from '@/components/Text';
import { colors, gameSizes, space } from '@/theme/tokens';
import { fontFamilies } from '@/theme/typography';

export type RadarAxis = {
  label: string;
  value: number;
};

export type RadarChartProps = {
  axes: readonly RadarAxis[];
  max: number;
  size?: number;
  title?: string;
};

const labelFontSize = 16;
const labelMargin = 28;

function pointAt(index: number, count: number, distance: number, center: number) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return { x: center + Math.cos(angle) * distance, y: center + Math.sin(angle) * distance };
}

function toPoints(points: { x: number; y: number }[]) {
  return points.map((point) => point.x.toFixed(1) + ',' + point.y.toFixed(1)).join(' ');
}

export function RadarChart({ axes, max, size = 280, title = 'Radar por categoria' }: RadarChartProps) {
  const count = axes.length;
  const center = size / 2;
  const outer = center - labelMargin;
  const safeMax = max > 0 ? max : 1;
  const summary = axes.map((axis) => axis.label + ' ' + axis.value).join(', ');

  if (count < 3) {
    return (
      <Text variant="bodySm" tone="muted">
        São precisas pelo menos 3 categorias para o radar.
      </Text>
    );
  }

  const rings = Array.from({ length: gameSizes.radarRings }, (_, ring) =>
    toPoints(axes.map((_, index) => pointAt(index, count, (outer * (ring + 1)) / gameSizes.radarRings, center))),
  );
  const shape = toPoints(
    axes.map((axis, index) =>
      pointAt(index, count, (outer * Math.max(0, Math.min(safeMax, axis.value))) / safeMax, center),
    ),
  );

  return (
    <View style={styles.root} accessible accessibilityRole="image" accessibilityLabel={title + ': ' + summary}>
      <Svg width={size} height={size}>
        {rings.map((points, ring) => (
          <Polygon key={ring} points={points} fill="none" stroke={colors.bevel} strokeWidth={1} />
        ))}
        {axes.map((axis, index) => {
          const end = pointAt(index, count, outer, center);
          return <Line key={axis.label} x1={center} y1={center} x2={end.x} y2={end.y} stroke={colors.bevel} strokeWidth={1} />;
        })}
        <Polygon points={shape} fill={colors.rune} fillOpacity={0.3} stroke={colors.rune} strokeWidth={space.px} />
        {axes.map((axis, index) => {
          const spot = pointAt(index, count, outer + labelMargin / 2, center);
          return (
            <SvgText
              key={axis.label}
              x={spot.x}
              y={spot.y + labelFontSize / 3}
              fill={colors.inkMuted}
              fontSize={labelFontSize}
              fontFamily={fontFamilies.label}
              textAnchor="middle"
            >
              {axis.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'center' },
});
