import type { Validator } from '@/game/validation';

export const validatorLabels: Record<Validator, { band: string; who: string; send: string }> = {
  ai: { band: 'IA (níveis 1–3)', who: 'a IA', send: 'Enviar para a IA' },
  peer: { band: 'Pares (níveis 4–6)', who: 'a guilda', send: 'Enviar para a guilda' },
  expert: { band: 'Especialista (7–10)', who: 'um especialista', send: 'Enviar ao especialista' },
};
