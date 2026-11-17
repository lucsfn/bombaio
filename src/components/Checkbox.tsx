import { ChoiceRow } from '@/components/ChoiceRow';
import { controls } from '@/theme/art';

export type CheckboxProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ label, value, onChange, disabled }: CheckboxProps) {
  return (
    <ChoiceRow
      label={label}
      checked={value}
      onPress={() => onChange(!value)}
      role="checkbox"
      art={value ? controls.checkOn : controls.checkOff}
      artPlacement="start"
      artSize="square"
      disabled={disabled}
    />
  );
}
