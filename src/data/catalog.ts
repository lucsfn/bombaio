import type { SkillArtName } from '@/theme/art';

export type CatalogSkill = {
  art: SkillArtName;
  name: string;
  areaId: string;
};

export const skillCatalog: readonly CatalogSkill[] = [
  { art: 'python', name: 'Python', areaId: 'tec' },
  { art: 'javascript', name: 'JavaScript', areaId: 'tec' },
  { art: 'react', name: 'React', areaId: 'tec' },
  { art: 'htmlCss', name: 'HTML e CSS', areaId: 'tec' },
  { art: 'git', name: 'Git', areaId: 'tec' },
  { art: 'dados', name: 'Dados', areaId: 'tec' },
  { art: 'logica', name: 'Lógica', areaId: 'tec' },
  { art: 'idiomas', name: 'Inglês', areaId: 'idi' },
  { art: 'oratoria', name: 'Oratória', areaId: 'com' },
  { art: 'escrita', name: 'Escrita', areaId: 'com' },
  { art: 'lideranca', name: 'Liderança', areaId: 'ges' },
  { art: 'projetos', name: 'Projetos', areaId: 'ges' },
  { art: 'financas', name: 'Finanças', areaId: 'ges' },
  { art: 'violao', name: 'Violão', areaId: 'mus' },
  { art: 'exercicio', name: 'Exercício', areaId: 'cor' },
  { art: 'culinaria', name: 'Culinária', areaId: 'cri' },
  { art: 'desenho', name: 'Desenho', areaId: 'cri' },
  { art: 'fotografia', name: 'Fotografia', areaId: 'cri' },
  { art: 'matematica', name: 'Matemática', areaId: 'men' },
  { art: 'meditacao', name: 'Meditação', areaId: 'men' },
];
