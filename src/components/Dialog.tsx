import { Modal, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { useReducedMotion } from '@/components/useReducedMotion';
import { colors, controlSizes, layout, radius, space } from '@/theme/tokens';

export type DialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  onCancel: () => void;
};

export function Dialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Cancelar',
  onCancel,
}: DialogProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? 'none' : 'fade'}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.scrim}>
        <View style={styles.box} accessibilityViewIsModal>
          <View style={styles.shadow} />
          <View style={styles.face}>
            <View style={styles.plate}>
              <Text variant="display4" accessibilityRole="header">
                {title}
              </Text>
            </View>
            <View style={styles.body}>
              <Text variant="body" tone="muted">
                {message}
              </Text>
              <View style={styles.actions}>
                <View style={styles.action}>
                  <Button label={cancelLabel} onPress={onCancel} />
                </View>
                <View style={styles.action}>
                  <Button label={confirmLabel} variant="gold" onPress={onConfirm} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.s4,
    backgroundColor: colors.scrim,
  },
  box: {
    width: '100%',
    maxWidth: layout.dialogMaxWidth,
    paddingBottom: controlSizes.hardShadow,
  },
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
    backgroundColor: colors.surface1,
    borderWidth: space.px,
    borderColor: colors.brass,
    borderRadius: radius.sm,
  },
  plate: {
    paddingHorizontal: space.s4,
    paddingVertical: space.s3,
    backgroundColor: colors.slate,
    borderBottomWidth: space.px,
    borderBottomColor: colors.iron,
  },
  body: { padding: space.s4, gap: space.s4 },
  actions: { flexDirection: 'row', gap: space.s3 },
  action: { flex: 1 },
});
