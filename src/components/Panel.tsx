import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Text';
import { colors, controlSizes, radius, space } from '@/theme/tokens';

export type PanelMaterial = 'slate' | 'stone' | 'obsidian';

export type PanelProps = {
  children: ReactNode;
  title?: string;
  material?: PanelMaterial;
  emphasis?: 'default' | 'legendary';
};

export function Panel({ children, title, material = 'slate', emphasis = 'default' }: PanelProps) {
  return (
    <View style={styles.root}>
      <View style={styles.shadow} />
      <View style={[styles.face, materials[material], emphasis === 'legendary' ? styles.legendary : null]}>
        {title ? (
          <View style={styles.plate}>
            <Text variant="label" tone="gold" uppercase>
              {title}
            </Text>
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const materials = StyleSheet.create({
  slate: { backgroundColor: colors.slate, borderColor: colors.iron },
  stone: { backgroundColor: colors.surface1, borderColor: colors.bevel },
  obsidian: { backgroundColor: colors.arcaneDeep, borderColor: colors.surface3 },
});

const styles = StyleSheet.create({
  root: { alignSelf: 'stretch', paddingBottom: controlSizes.hardShadow },
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: controlSizes.hardShadow,
    bottom: 0,
    backgroundColor: colors.outline,
    borderRadius: radius.sm,
  },
  face: {
    padding: space.s4,
    gap: space.s3,
    borderWidth: space.px,
    borderRadius: radius.sm,
  },
  legendary: { borderColor: colors.gold },
  plate: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.s2,
    paddingVertical: space.px,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
  },
});
