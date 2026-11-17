import { ChoiceRow } from '@/components/ChoiceRow';
import { controls } from '@/theme/art';

export type RadioProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Radio({ label, value, onChange, disabled }: RadioProps) {
  return (
    <ChoiceRow
      label={label}
      checked={value}
      onPress={() => onChange(true)}
      role="radio"
      art={value ? controls.radioOn : controls.radioOff}
      artPlacement="start"
      artSize="square"
      disabled={disabled}
    />
  );
}
