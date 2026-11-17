import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import type { IconName } from '@/theme/art';
import { colors, radius, space } from '@/theme/tokens';
import { typography } from '@/theme/typography';

export type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  secure?: boolean;
  icon?: IconName;
  editable?: boolean;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  secure = false,
  icon,
  editable = true,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const message = error ?? helper;

  return (
    <View style={styles.root}>
      <Text variant="label" tone="muted" uppercase>
        {label}
      </Text>
      <View
        style={[
          styles.field,
          focused ? styles.fieldFocused : null,
          error ? styles.fieldError : null,
          editable ? null : styles.fieldDisabled,
        ]}
      >
        {icon ? <Icon name={icon} size={32} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkDim}
          secureTextEntry={secure}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={message}
          accessibilityState={{ disabled: !editable }}
          selectionColor={colors.arcane}
          style={styles.input}
        />
      </View>
      {message ? (
        <Text variant="bodySm" tone={error ? 'blood' : 'dim'}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: space.s1, alignSelf: 'stretch' },
  field: {
    minHeight: space.ctlHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingHorizontal: space.s3,
    backgroundColor: colors.surface2,
    borderWidth: space.px,
    borderColor: colors.bevel,
    borderRadius: radius.sm,
  },
  fieldFocused: { borderColor: colors.arcane },
  fieldError: { borderColor: colors.blood },
  fieldDisabled: { backgroundColor: colors.surface3 },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.ink,
    paddingVertical: space.s2,
  },
});
