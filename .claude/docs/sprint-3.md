# Sprint 3 · Front-end do Bombaio (divisão e plano)

Documento de trabalho da Sprint 3. Vale junto com o `CLAUDE.md` da raiz; se divergirem, o `CLAUDE.md` manda. Toda sessão de IA que for implementar algo da Sprint 3 lê este arquivo antes.

## 1. A entrega

Seção do documento da disciplina:

> **4. Uso do Software**: breve descrição do software.
> **4.1 Front-end**: partes relevantes do código: uso dos principais componentes visuais, contexto, rotas e navegação entre telas.

Ou seja: o **front-end pronto e navegável**, com dados locais de exemplo, e trechos de código que mostrem quatro coisas: **componentes**, **contexto**, **rotas** e **navegação**. Back-end, banco (SQLite) e API de IA **não fazem parte** desta sprint.

## 2. Divisão: duas frentes, em sequência

| | Frente A: Componentes e estilo | Frente B: Telas, navegação e estado |
|---|---|---|
| Dono | **Lucas** | **Eduardo (Dudu)** |
| Começa | primeiro | depois que a Fase A2 estiver pronta |
| Pastas | `src/theme/`, `src/components/`, `assets/`, `src/app/dev/` (vitrine) | `src/app/` (exceto `dev/`), `src/state/`, `src/game/`, `src/data/` |
| No documento | "principais componentes visuais" | "contexto, rotas e navegação" |

O trabalho é **sequencial de propósito**: o Dudu entra quando os componentes de que as telas dependem já existem. Por isso a Frente A é organizada em fases, e cada fase destrava uma parte da Frente B.

## 3. Decisões de base (fechar antes da primeira linha de código)

| decisão | proposta | situação |
|---|---|---|
| Roteamento | **Expo Router** (rotas por arquivo em `src/app/`; usa React Navigation por baixo) | **decidido** (Lucas, 17/11). Ajustar o Quadro 2 do documento na entrega, que cita React Navigation |
| Estado | Context API + `useReducer`, um provedor `GameProvider` | proposta |
| Dados | `src/data/mock.ts` tipado, copiado do `WORLD` do Storybook | proposta |
| Estilo | `StyleSheet` do React Native + tokens de `src/theme/`. Sem biblioteca de UI (NativeBase, Paper, Tamagui…) e sem Tailwind/NativeWind | proposta |
| Fontes | `expo-font` + `@expo-google-fonts/jersey-15`, `vt323` e `atkinson-hyperlegible` | **decidido** e instalado (Lucas, 17/11) |
| Árvore | as 25 árvores rasterizadas em PNG a partir dos SVGs do Storybook (os SVGs têm até 3 MB cada e pesariam no `react-native-svg`) | **decidido** (Lucas, 17/11): PNG 942×942 |
| Gestos/animação | `react-native-gesture-handler` + `react-native-reanimated` (zoom e pinça da árvore) | proposta |

Enquanto uma decisão estiver como "proposta", a IA segue a proposta, mas **não instala dependência** sem confirmação do Lucas na conversa.

## 4. Frente A: Lucas (componentes e estilo)

### Fase A1: Fundação (destrava tudo)
- `src/theme/tokens.ts`: cores, espaços (escala 4/8), raios, sombras, durações e easing, transcritos do `tokens.json` do Storybook. **Nenhuma cor ou tamanho cru fora deste arquivo.**
- `src/theme/typography.ts`: escalas display (Jersey 15: 34/28/24/20/18), rótulo (VT323: 18/16) e corpo (Atkinson: 16/14).
- Carregamento das fontes com a splash segurando até carregar.
- `assets/`: ícones (128 e 32), skills, ornamentos, controles e as 25 árvores, com nomes iguais aos do Storybook.
- Alias `@/` para `src/` no `tsconfig.json`. **Sem `src/components/index.ts`**: cada import aponta para o arquivo (`@/components/Button`), por causa da regra `bundle-barrel-exports` (o checker barra).

### Fase A2: Primitivos (destrava o início da Frente B)
| componente | props principais | notas |
|---|---|---|
| `Text` | `variant: 'display1'…'display5' \| 'label' \| 'labelSm' \| 'body' \| 'bodySm'`, `tone` | toda tipografia passa por ele |
| `Button` | `variant: 'gold' \| 'iron'`, `label`, `icon?`, `onPress`, `disabled?`, `loading?` | um único `gold` por tela; pressionar afunda 2px; 48px de altura |
| `IconButton` | `icon`, `accessibilityLabel` (obrigatório), `onPress` | área de toque ≥ 44px |
| `Icon` | `name`, `size: 32 \| 128` | lê do registro de assets, nunca `require` solto nas telas |
| `Input` | `label`, `value`, `onChangeText`, `error?`, `helper?`, `secure?` | rótulo visível sempre |
| `Checkbox`, `Radio`, `Toggle` | `value`, `onChange`, `label` | arte de `assets/controles/` |
| `Chip` | `label`, `selected?`, `onPress?` | |

### Fase A3: Superfícies e layout
`Screen` (área segura, fundo, rolagem opcional), `Panel`/`Frame` (moldura 9-slice: `slate`, `stone`, `obsidian`), `Card`, `ListRow`, `ScreenHeader` (título + voltar), `TabBar` (padrão do Storybook: borda a borda, ícones 32, indicador no topo), `Dialog`, `Toast`, `EmptyState`, `Skeleton`.

### Fase A4: Componentes de jogo
`XPBar`, `LevelPips` (10 casas na cor do estado), `ValidationBadge` (IA/pares/especialista), `StatChip`, `QuestCard`, `AchievementMedal` (bronze/prata/ouro/obsidiana/bloqueada), `SkillMedallion` (estados `validated | current | available | seed`), `TreeHeader` (nome, "NN/20" ou Poder, régua de 25 casas, barra até a próxima), `RadarChart` (por categoria), `ProgressRing`, `Stepper`.

### Fase A5: `SkillTree` (a peça central)
Árvore da variante atual, medalhões nos encaixes medidos (`TREES[i].s` do Storybook), veios pai→filho, zoom por pinça e botões (+, −, ver tudo), e o acordeão por área abaixo dela. Recebe dados por props (`skills`, `variant`, `openArea`, `onSelectSkill`); **não lê o Context**. Também `TreeEvolution` (as 25 árvores com requisitos).

### Vitrine
`src/app/dev/` mostra cada componente em todos os estados (como o Storybook, mas dentro do app). Todo componente novo entra na vitrine no mesmo PR. A rota `dev` some do build final ou fica escondida atrás de um toque longo no logo (decidir na Fase A5).

### Pronto da Frente A
Fases A1 a A4 com vitrine e gate verde. A A5 pode correr em paralelo com o início da Frente B.

## 5. Frente B: Dudu (telas, navegação e estado)

### Fase B1: Estrutura
- `src/app/_layout.tsx` (provedores: fontes, `GameProvider`, gestos), `(tabs)/_layout.tsx` com Herói, Skills, Missões e Perfil, e a pilha com Detalhe, Avaliação e Conquista.
- `src/data/mock.ts` tipado (`types.ts` com `Hero`, `Skill`, `Area`, `Mission`, `Achievement`, `Title`, alinhados ao DER da Sprint 2).
- `src/state/GameProvider.tsx` + `useGame()`: ações `completeMission`, `submitAssessment`, `addSkill`, `equipTitle`, `unlockAchievement`.

### Fase B2: Regras do jogo (funções puras, testadas)
`src/game/`: `xpForLevel`, `levelFromXp`, `validatorForLevel` (1–3 IA, 4–6 pares, 7–10 especialista), `masteryScore` (Σ nível² das validadas), `treeVariant` (inclui requisitos dos poderes), `missionReward`. Cada uma com teste antes da implementação.

### Fase B3: As 7 telas do protótipo (Figma)
Herói, Skills (árvore), Detalhe da skill, Avaliação, Missões, Perfil e Conquista desbloqueada, ligadas como no protótipo: missão dá XP, primeira conclusão abre a conquista, avaliação enviada muda o selo, a área aberta na árvore é lembrada ao voltar.

### Fase B4: Além do protótipo
| tela | por quê |
|---|---|
| Login e Cadastro (só front, sem autenticação real) | histórias de usuário da Sprint 1 |
| Adicionar/editar skill | história da Sprint 1 |
| Radar por categoria (no Perfil ou tela própria) | história da Sprint 1 |
| Onboarding (escolha das primeiras skills, explicação da validação) | primeira impressão |
| Histórico de níveis da skill | dá sentido à validação |
| Evolução da árvore (as 25 e o que falta) | motivação de longo prazo |
| Conquistas e títulos | completa o laço do jogo |
| Configurações (conta, notificações, reduzir movimento) | acessibilidade |
| Estados vazios e de carregamento em todas as telas | qualidade |

### Pronto da Frente B
Todas as telas navegáveis com dados de exemplo, estado coerente entre telas, regras com testes, gate verde.

## 6. Cenários de impasse e como reagir

A regra geral: **parar, decidir pelo caminho que preserva o sistema, registrar a decisão** (neste arquivo ou no `CLAUDE.md`). Nunca resolver um impasse em silêncio.

### 6.1 A tela precisa de um componente que não existe
1. Procurar antes: a pasta `src/components/`, a vitrine e o Storybook. Muitas vezes é uma variante de algo existente (um `Card` com outro conteúdo, não um `NovoCard`).
2. Se for mesmo novo e **reutilizável** (aparece ou vai aparecer em 2+ telas): é da Frente A. Se o Lucas estiver disponível, ele faz. Se não, quem precisa cria **seguindo a seção 7**, em `src/components/`, com entrada na vitrine, e avisa o Lucas no PR.
3. Se for **específico de uma tela só**: fica junto da tela (`src/app/<rota>/_components/`), mas usando só tokens e primitivos. Se depois for reutilizado, sobe para `src/components/`.
4. Nunca: estilo inline com cor crua, cópia de outro componente com ajustes, ou componente de biblioteca externa.

### 6.2 O componente existe, mas não atende
- Falta uma variação pequena (um ícone, um tamanho): **adicionar prop opcional** com padrão que não muda o comportamento atual. Atualizar a vitrine.
- A mudança mudaria o visual onde já é usado: não mudar; abrir a discussão com o dono (Lucas). Enquanto isso, a tela usa o componente como está.
- Proibido: `style` passado de fora para "consertar" layout interno do componente, ou bifurcar o componente (`ButtonDudu`).

### 6.3 O Figma, o Storybook e o pedido divergem
Ordem de autoridade: **pedido explícito da dupla na conversa** > **Storybook** (design system em vigor) > **Figma** (protótipo, que é captura do Storybook e pode estar defasado) > opinião da IA. A divergência é registrada na seção 9.

### 6.4 Falta definição de design (tela nova sem referência)
Montar a tela **só com componentes existentes**, seguindo os padrões das telas prontas (cabeçalho, painel, uma ação dourada no fim). Não inventar estilo novo. Marcar a tela na seção 9 como "layout provisório, revisar".

### 6.5 Falta regra de jogo (quanto XP, qual limite)
Não inventar número silenciosamente. Usar uma constante nomeada em `src/game/constants.ts` com valor provisório, listar na seção 9 e perguntar à dupla. Valores já decididos estão no Storybook (`docs/arvores/`) e no `CLAUDE.md`.

### 6.6 A dependência necessária não está instalada
Parar e perguntar. Se aprovada: `npx expo install <pacote>` (nunca `npm install` direto), conferir com `npx expo-doctor` e registrar na tabela da seção 3. Se exigir build de desenvolvimento (fora do Expo Go), avisar antes, porque muda como a dupla testa.

### 6.7 O quality gate falha por algo que não é meu
Não contornar (sem `@ts-ignore`, sem desativar regra). Se a correção é pequena e óbvia, corrigir e dizer no relatório. Se é do território do outro, relatar com a saída do erro e parar.

### 6.8 Os dois precisam mexer no mesmo arquivo
Dono da pasta decide (seção 2). Arquivos compartilhados (`app.json`, `package.json`): mudanças pequenas e em PR separado, avisando o outro. Conflito de merge é resolvido por quem abriu o PR mais recente.

### 6.9 A `SkillTree` atrasa e bloqueia a tela Skills
A tela Skills entra primeiro com uma versão provisória (`TreeHeader` + imagem da árvore sem medalhões + acordeão por área), e a `SkillTree` completa substitui depois sem mudar a interface de props. Se o atraso passar de uma semana, a `SkillTree` pode ser repassada ao Dudu (decisão da dupla).

### 6.10 Desempenho ruim (árvore, listas)
Medir antes de otimizar. Primeiros suspeitos: imagem grande demais (usar o PNG no tamanho de exibição), lista sem `FlatList`, re-render do Context inteiro (separar contexto ou usar seletores), animação fora do Reanimated.

### 6.11 Algo que já foi rejeitado volta como ideia
Consultar a lista de rejeitados no `CLAUDE.md` (árvore por código, vista galho, física que treme, madeira/pergaminho…). Se está lá, não fazer, mesmo que pareça boa ideia; levar à dupla com o motivo.

### 6.12 A IA não tem certeza se pode
Perguntar. Uma pergunta curta custa menos que desfazer trabalho.

## 7. Como criar um componente (o estilo do projeto)

1. **Um componente por arquivo**: `src/components/<Nome>.tsx` (ou pasta `<Nome>/` se tiver subpartes), importado pelo caminho do arquivo (sem barrel). Nome em inglês, PascalCase, igual ao do Storybook quando existir lá.
2. **Props tipadas** com `type <Nome>Props`, exportado. Variantes como união de strings literais, nunca booleanos em série (`variant='gold'`, não `isGold isBig`).
3. **Estilo** em `StyleSheet.create` no fim do arquivo, só com valores de `src/theme/`. Nada de número mágico de cor, espaço ou fonte.
4. **Visual**: segue a "Saga rúnica" (seção 3 do `CLAUDE.md`): materiais frios, pixel art 128 para arte, cor de significado em filete ou texto (não na moldura inteira), dourado só para recompensa e ação principal.
5. **Estados completos**: padrão, pressionado (afunda 2px), foco, desabilitado (cinza), carregando quando houver ação assíncrona.
6. **Acessibilidade**: `accessibilityRole`, `accessibilityLabel` (obrigatório em ícone sem texto), `accessibilityState` (disabled, selected, checked), toque ≥ 44px, contraste ≥ 4.5:1, respeita "reduzir movimento".
7. **Movimento**: só transform e opacidade, 150 a 300ms, com propósito (feedback, continuidade). Nada decorativo em ação repetida.
8. **Sem lógica de jogo e sem Context dentro**: componente recebe dados e devolve eventos por props. Quem lê o estado é a tela.
9. **Sem comentários no código** (regra 1.2 do `CLAUDE.md`). Se algo precisa de explicação, o nome está errado ou a explicação vai neste documento.
10. **Vitrine**: entra em `src/app/dev/` com todas as variantes e estados no mesmo PR.

### Como criar uma tela
1. Arquivo em `src/app/` conforme a rota; componentes específicos em `_components/` ao lado.
2. Composição só de componentes de `src/components/`; nenhum `StyleSheet` com cor crua.
3. Lê o estado com `useGame()`; dispara ações; nunca altera dados direto.
4. Todos os estados: carregando, vazio, erro, normal.
5. Um único `Button variant="gold"` por tela.
6. Navegação com `router`/`Link` do Expo Router; voltar sempre previsível.

## 8. Fluxo de trabalho e quality gate

- **Branches**: `front/a-<fase>-<assunto>` (Lucas) e `front/b-<fase>-<assunto>` (Dudu). PRs pequenos, um assunto cada.
- **Gate** (antes de pedir revisão): `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor`, `node .claude/scripts/rn-rules-check.js` e a revisão pelas skills (seção 4 do `CLAUDE.md`) e, a partir da Fase B2, `npm test`. Tudo verde.
- **Revisão cruzada**: o Dudu revisa PRs de componente pelo uso (dá para montar a tela com isso?); o Lucas revisa PRs de tela pelo uso correto dos componentes e do tema.
- **IA**: implementa, roda o gate e commita na branch da frente, **sem coautoria do modelo** (regra 1.1 do `CLAUDE.md`). Não dá push nem abre PR. Termina cada tarefa com: o que mudou, saída do gate e o hash do commit.
- **Teste em aparelho**: ao fim de cada fase, abrir no Expo Go (ou build de desenvolvimento) num Android real.

## 9. Registro de decisões e pendências

Atualizar aqui durante a sprint (data, decisão, quem).

| data | item | situação |
|---|---|---|
| 2026-11-17 | Roteamento: **Expo Router** (rotas em `src/app/`, entrada `expo-router/entry`) | decidido (Lucas) |
| 2026-11-17 | Rota de vitrine `dev` no build final | aberto |
| 2026-11-17 | Dependências da A1 aprovadas: expo-font, expo-splash-screen, Google Fonts (Jersey 15, VT323, Atkinson), expo-router e pares, ESLint (`eslint-config-expo`, instalado com `--legacy-peer-deps`) | decidido (Lucas) |
| 2026-11-17 | Árvores em PNG 942×942 (grade 314 × 3, vizinho mais próximo) em `assets/arvores/`, registro em `src/theme/art.ts` | decidido (Lucas) |
| 2026-11-17 | `src/app/_layout.tsx` (fontes + splash + Stack) e `src/app/index.tsx` (redireciona para `/dev`) criados pela Frente A como base mínima; o Dudu assume e substitui na B1 | provisório |
| 2026-11-17 | `expo-image` aprovado e instalado (Fase A2) | decidido (Lucas) |
| 2026-11-17 | Botões, campo e chip desenhados com borda e preenchimento dos tokens, sem a arte 9-slice (`ctl-btn-*`, `ctl-input`, `ctl-chip`): o `expo-image` não faz 9-slice. Checkbox, Radio e Toggle usam a arte de `assets/controles/` | provisório, revisar com a dupla |
| 2026-11-17 | Fase A3: `Panel` (slate, stone, obsidian, lendário) e `Dialog` também desenhados com borda e preenchimento dos tokens, sem `frame-*.png` nem cantoneiras de latão (mesmo motivo do 9-slice) | provisório, revisar com a dupla |
| 2026-11-17 | `TabBar` genérica (`items`, `activeKey`, `onSelect`), sem depender do Expo Router; o Dudu liga no `tabBar` do navegador de abas na B1 | decidido (Lucas) |
| 2026-11-17 | Vitrine em duas páginas: `/dev` (A1–A2) e `/dev/superficies` (A3) | decidido (Lucas) |
| 2026-11-17 | `react-native-svg` aprovado e instalado (`--legacy-peer-deps`) para `RadarChart` e `ProgressRing` | decidido (Lucas) |
| 2026-11-17 | Medalhão validado usa a arte original do Storybook (`node-validated.png`). Uma recoloração gerada por engano no commit `4763fd2` foi desfeita no commit seguinte | decidido (Lucas) |
| 2026-11-17 | `SkillMedallion` e `AchievementMedal` usam as artes do Storybook (`node-*`, `ach-*`) com o ícone no centro; o estado `seed` usa o aro `node-locked` com cadeado | decidido (Lucas) |
| 2026-11-17 | Vitrine da A4 em `/dev/jogo` | decidido (Lucas) |
| 2026-11-17 | `react-native-gesture-handler` 3, `react-native-reanimated` 4 e `react-native-worklets` aprovados e instalados (`--legacy-peer-deps`); `GestureHandlerRootView` no `_layout.tsx` raiz | decidido (Lucas) |
| 2026-11-17 | Dados das 25 árvores (nome, chão, copa, mínimos, requisitos dos poderes e encaixes medidos `s`) extraídos do `TREES` do Storybook para `src/theme/trees.ts`; a máscara `m` e o centro `k` ficaram de fora | decidido (Lucas) |
| 2026-11-17 | `SkillTree` (`src/components/SkillTree/SkillTree.tsx`): props `skills`, `areas`, `variant`, `openArea`, `onOpenAreaChange`, `onSelectSkill`; não lê o Context. A escolha da variante (`treeScore`/`treeVariant`) é regra de jogo e fica em `src/game/` (B2) | decidido (Lucas) |
| 2026-11-17 | Zoom da árvore: pinça, arrastar e botões +/−/ver tudo (1× a 4×). Os medalhões crescem menos que a cena (escala z^−0,8), o que afasta os vizinhos sem física. Ficaram de fora do Storybook: grafo com colisão, arrastar nó para nova casa, nomes sobre a árvore a partir de 1,8× | provisório, revisar com a dupla |
| 2026-11-17 | Vitrine da A5 em `/dev/arvore` com o `WORLD` de exemplo do Storybook | decidido (Lucas) |
| 2026-11-20 | Frente B assumida pelo Lucas (o Dudu não vai codar nesta etapa). Ordem invertida: B2 (regras) antes da B1, porque o `GameProvider` depende das regras de XP | decidido (Lucas) |
| 2026-11-20 | Testes: `jest`, `jest-expo`, `@react-native/jest-preset`, `@testing-library/react-native` e `@types/jest` aprovados e instalados (`--legacy-peer-deps`); `npm test` roda o Jest; os testes importam de `@jest/globals` | decidido (Lucas) |
| 2026-11-20 | `HERO_XP_PER_LEVEL = 1000` e `PRACTICE_XP_PER_TARGET_LEVEL = 100` (`src/game/constants.ts`) deduzidos dos números do protótipo (herói nível 12 com 740/1000; Python 180/400 rumo ao nível 4). Não há curva de XP decidida | provisório, perguntar à dupla |
| 2026-11-20 | Pontuação de domínio soma o quadrado do `level` de todas as skills, onde `level` é sempre o último nível validado (regra de `docs/arvores/evolucao-natural.md` do Storybook). O `treeScore` do bundle do Storybook só contava skills no estado `validated`; segui o documento de regras | decidido (Lucas), divergência registrada |
| 2026-11-20 | Baú semanal de 500 XP (`WEEKLY_CHEST_XP`), tirado do protótipo do Storybook | decidido (Lucas) |
| 2026-11-20 | B1: tipos em `src/data/types.ts` alinhados ao DER (Hero/USUARIO, Area/CATEGORIA, Skill, Assessment/AVALIACAO, LevelRecord/HISTORICO_NIVEL, Mission/MISSAO, Achievement/CONQUISTA, Title/TITULO); `GameProvider` com `useReducer` (`src/state/gameReducer.ts`, testado) e seletores puros em `src/state/selectors.ts`; rotas: `(tabs)` com Herói, Skills, Missões e Perfil, pilha com `skill/[id]`, `avaliacao/[id]` e `conquista` (modal transparente). O redirecionamento `/` → `/dev` saiu; a vitrine continua em `/dev` | decidido (Lucas) |
| 2026-11-20 | Dados de exemplo: Python ficou no nível 3, em foco, validado por IA, com 180/400 de prática, como nas telas do protótipo (o `WORLD` do Storybook dizia nível 5 validado). Algoritmos passou a "disponível" para Python ser a skill em foco | decidido (Lucas), divergência registrada |
| 2026-11-20 | O botão "Iniciar avaliação" não exige a prática completa, porque o fluxo do protótipo envia a avaliação do Python com 180/400; a prática aparece só como item informativo. `canRequestAssessment` existe e está testada, mas não bloqueia a tela | provisório, perguntar à dupla |
| 2026-11-20 | Textos sem referência no Storybook, criados para a B3: "Seu nível N está com {quem}. A resposta aparece aqui.", "Nível N é validado por {quem}.", rótulos de envio por faixa ("Enviar para a IA", "Enviar ao especialista"), "Agora não"/"Continuar" na conquista, estados vazios das abas Semanais/Principais e das abas Avaliação/Evolução do detalhe | layout e texto provisórios, revisar |
| 2026-11-20 | Componentes novos para a B3: `Avatar`, `Segmented`, `SectionHeader` (existem no Storybook, não estavam nas fases A); `AchievementMedal` ganhou `showTitle` opcional | decidido (Lucas) |

## 10. Material para a seção 4.1 do documento

Ao longo da sprint, cada um separa trechos curtos (10 a 30 linhas) que ilustrem:
- **Lucas**: os tokens do tema, um primitivo (`Button`) com variantes e estados, e a `SkillTree` recebendo props.
- **Dudu**: o `_layout.tsx` das abas e da pilha (rotas), o `GameProvider` e `useGame()` (contexto), uma navegação com parâmetro (Skills → Detalhe) e uma regra de jogo com teste.

Prints das telas no aparelho entram junto, com a mesma numeração de figura usada na Sprint 2.
