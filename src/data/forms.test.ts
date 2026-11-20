import { describe, expect, it } from '@jest/globals';
import { emailError, passwordError } from '@/data/forms';

describe('emailError', () => {
  it('aceita um e-mail bem formado', () => {
    expect(emailError('heroi@bombaio.app')).toBeUndefined();
  });

  it('pede o e-mail quando vazio', () => {
    expect(emailError('  ')).toBe('Informe seu e-mail.');
  });

  it('recusa formato inválido', () => {
    expect(emailError('heroi@')).toBe('Use um e-mail válido, como nome@exemplo.com.');
  });
});

describe('passwordError', () => {
  it('aceita 6 caracteres ou mais', () => {
    expect(passwordError('segredo')).toBeUndefined();
  });

  it('recusa senha curta', () => {
    expect(passwordError('abc')).toBe('A senha precisa de pelo menos 6 caracteres.');
  });
});
