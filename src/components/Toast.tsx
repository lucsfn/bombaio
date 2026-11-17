import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { colors, layout, radius, space } from '@/theme/tokens';

export type ToastTone = 'xp' | 'ok' | 'error';

export type ToastProps = {
  visible: boolean;
  tone: ToastTone;
  title: string;
  subtitle?: string;
  onDismiss: () => void;
};

const toneColors: Record<ToastTone, string> = {
  xp: colors.gold,
  ok: colors.rune,
  error: colors.blood,
};

const toneText = { xp: 'gold', ok: 'rune', error: 'blood' } as const;

export function Toast({ visible, tone, title, subtitle, onDismiss }: ToastProps) {
  const insets = useSafeAreaInsets();

  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!visible || tone === 'error') return;
    const timer = setTimeout(() => dismissRef.current(), layout.toastDuration);
    return () => clearTimeout(timer);
  }, [visible, tone, title]);

  if (!visible) return null;

  const spoken = subtitle ? title + '. ' + subtitle : title;

  return (
    <View style={[styles.layer, { top: insets.top + space.s2 }]} pointerEvents="box-none">
      <Pressable
        onPress={onDismiss}
        accessibilityRole="alert"
        accessibilityLabel={spoken}
        accessibilityHint="Toque para fechar"
        accessibilityLiveRegion={tone === 'error' ? 'assertive' : 'polite'}
        style={[styles.toast, { borderColor: toneColors[tone] }]}
      >
        <Text variant="display5" tone={toneText[tone]}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySm" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', left: space.s3, right: space.s3, zIndex: 20 },
  toast: {
    minHeight: space.ctlHeight,
    justifyContent: 'center',
    gap: space.px,
    paddingHorizontal: space.s4,
    paddingVertical: space.s3,
    backgroundColor: colors.arcaneDeep,
    borderWidth: space.px,
    borderRadius: radius.sm,
  },
});
