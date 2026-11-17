import { ChoiceRow } from '@/components/ChoiceRow';
import { controls } from '@/theme/art';

export type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ label, value, onChange, disabled }: ToggleProps) {
  return (
    <ChoiceRow
      label={label}
      checked={value}
      onPress={() => onChange(!value)}
      role="switch"
      art={value ? controls.toggleOn : controls.toggleOff}
      artPlacement="end"
      artSize="wide"
      disabled={disabled}
    />
  );
}
