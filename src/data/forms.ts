const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailError(value: string): string | undefined {
  const email = value.trim();
  if (email === '') return 'Informe seu e-mail.';
  if (!EMAIL_PATTERN.test(email)) return 'Use um e-mail válido, como nome@exemplo.com.';
  return undefined;
}

export function passwordError(value: string): string | undefined {
  if (value.length < MIN_PASSWORD_LENGTH) return 'A senha precisa de pelo menos ' + MIN_PASSWORD_LENGTH + ' caracteres.';
  return undefined;
}
