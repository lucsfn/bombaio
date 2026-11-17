import { StyleSheet, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text, type TextTone } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, radius, space } from '@/theme/tokens';

export type ValidationKind = 'ai' | 'peer' | 'expert' | 'pending' | 'failed';

export type ValidationBadgeProps = {
  kind: ValidationKind;
  label?: string;
  sub?: string;
};

const kinds: Record<ValidationKind, { icon: IconName; color: string; tone: TextTone; label: string; sub: string }> = {
  ai: { icon: 'check', color: colors.rune, tone: 'rune', label: 'Validado', sub: 'por IA (níveis 1–3)' },
  peer: { icon: 'user', color: colors.arcaneGlow, tone: 'arcane', label: 'Revisão', sub: 'por pares (4–6)' },
  expert: { icon: 'shield', color: colors.gold, tone: 'gold', label: 'Especialista', sub: 'certificado (7–10)' },
  pending: { icon: 'scroll', color: colors.inkMuted, tone: 'muted', label: 'Aguardando', sub: 'avaliação' },
  failed: { icon: 'heart', color: colors.blood, tone: 'blood', label: 'Não aprovado', sub: 'refazer' },
};

export function ValidationBadge({ kind, label, sub }: ValidationBadgeProps) {
  const spec = kinds[kind];
  const title = label ?? spec.label;
  const detail = sub ?? spec.sub;

  return (
    <View
      style={[styles.badge, { borderColor: spec.color }]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={title + ', ' + detail}
    >
      <Icon name={spec.icon} size={32} />
      <View>
        <Text variant="display5" tone={spec.tone}>
          {title}
        </Text>
        <Text variant="labelSm" tone="muted">
          {detail}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.s2,
    paddingVertical: space.s2,
    paddingHorizontal: space.s3,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderRadius: radius.sm,
  },
});
