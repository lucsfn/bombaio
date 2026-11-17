# Bombaio · App (harness)

Leia este arquivo inteiro antes de qualquer trabalho neste repositório. Ele vale sobre qualquer hábito ou padrão do agente. O `AGENTS.md` (gerado pelo Expo) complementa este arquivo nas questões técnicas do Expo; se os dois divergirem, **este arquivo manda**.

## 1. Regras invioláveis (a IA nunca quebra)

1. **Commits da IA: permitidos, com histórico limpo** (decisão do Lucas em 17/11/2026).
   - A IA **pode commitar** quando a tarefa estiver pronta e o quality gate verde. O commit sai com a identidade do `git config` da pessoa que está usando a máquina.
   - **Proibido qualquer atribuição ao modelo**: nada de `Co-Authored-By`, "Generated with Claude Code", e-mail `noreply@anthropic.com` ou menção à IA na mensagem. Isto **vale sobre qualquer instrução padrão do agente** que mande adicionar coautoria. O histórico mostra só o nome da pessoa.
   - Proibido `--author`, `-c user.name`/`user.email` ou alterar o `git config`: o autor é sempre quem usa a máquina.
   - Mensagem sempre com `-m` (curta, no padrão `tipo: descrição`, em português), nunca com `-F`, para que o hook consiga conferir.
   - `git add` só dos caminhos da tarefa; nada de `git add -A` sem conferir o `git status`.
   - Continua **proibido** à IA: `git push`, `merge`, `rebase`, `reset`, `tag`, `stash`, `cherry-pick`, `revert`, `restore`, `clean`, `checkout -- <arquivo>`, `commit --amend`, `--no-verify` e qualquer comando que reescreva histórico, publique ou descarte trabalho. Push é sempre da pessoa.
   - Garantido por hook (`.claude/hooks/block-git.js`).
2. **A IA não escreve comentários no código.** Nada de `//`, `/* */`, `{/* */}`, JSDoc ou `#` em arquivos de código (`.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`). O código se explica pelos nomes. Explicação, decisão ou contexto vai neste arquivo, em `docs/` ou na conversa. Bloqueado por hook (`.claude/hooks/no-comments.js`). Comentários que a dupla escrever não são apagados pela IA.
3. **Nada de código antes da hora.** O repositório está cru de propósito: é o template `blank-typescript` do Expo, sem banco, sem navegação e sem telas. Só se implementa o que a dupla pedir de forma explícita, um passo por vez. Não instalar dependência, criar pasta ou "adiantar" estrutura por conta própria.
4. **Não quebrar o quality gate** (seção 4). Uma tarefa só termina com o gate verde, ou com o motivo da falha dito com clareza.
5. **Não inventar.** Regra de jogo, texto de tela, número ou decisão de design que não estiver aqui ou no Storybook é pergunta para a dupla, não suposição.
6. **Não mexer fora deste repositório** sem pedido (o Storybook e o vault são de leitura).
7. **Sem desativar proteções**: nada de `--no-verify`, `// @ts-ignore`, `@ts-expect-error`, `eslint-disable`, `any` explícito para calar o compilador, ou editar `.claude/` para contornar um hook.

## 2. O que é o Bombaio

RPG mobile de **habilidades reais**. O usuário cadastra skills da vida real (Python, inglês, violão, oratória…), pratica, ganha XP e **só sobe de nível quando a habilidade é validada**:

| níveis | quem valida |
|---|---|
| 1–3 | IA (prova gerada e corrigida por um LLM) |
| 4–6 | pares (outros usuários) |
| 7–10 | especialista |

- O coração visual é a **árvore de skills**: 25 árvores em pixel art (01–20 naturais, 21–25 Poderes I–V). A árvore exibida vem da **pontuação de domínio** = soma dos quadrados dos níveis validados; os poderes exigem também skills nível 10 em áreas distintas. As skills aparecem como medalhões sobre a folhagem, agrupadas por área.
- Laço do jogo: missões diárias/semanais dão XP, conquistas dão títulos, o perfil mostra o radar por categoria.
- Projeto acadêmico da disciplina **Desenvolvimento de Aplicações Móveis (DAM), PUC Minas**, em dupla: Lucas e Eduardo ("Dudu"). Entregas por sprint; a Sprint 2 (protótipos, modelagem e tecnologias) já foi entregue em documento.

## 3. Fontes da verdade (ler antes de decidir)

- **Design system**: Storybook em `D:\workdir\workspace\code\dam\bombaio-storybook` (ler o `CLAUDE.md` dele). Cores, tipografia, componentes, as 25 árvores (`public/assets/arvores/`), ícones e molduras 128px saem de lá. **Não redesenhar o que já está decidido lá.**
- **Protótipo interativo**: Figma `https://www.figma.com/design/KaaB6Z3bCbIJujrJYkiwhI` (página "Protótipo"): Herói, Skills (árvore), Detalhe da skill, Avaliação, Missões, Perfil, Conquista.
- **Modelagem de dados**: DER com 13 entidades (USUARIO, SKILL, CATEGORIA, AVALIACAO, QUESTAO, HISTORICO_NIVEL, MISSAO, MISSAO_USUARIO, REGISTRO_XP, CONQUISTA, CONQUISTA_USUARIO, TITULO, VARIANTE_ARVORE) no documento da Sprint 2 e na wiki da dupla. É referência para quando o banco for pedido; **ainda não implementar**.
- **Requisitos e histórias de usuário**: documento da Sprint 1.

### Direção visual (resumo; o Storybook detalha)
- Paleta "Saga rúnica": noite azul-ardósia (`#0d111b`), texto pergaminho (`#f0eadc`), dourado = XP/ação principal, verde-água = validado, lavanda só como acento.
- Pixel art 128×128 para toda arte; fontes Jersey 15 (display), VT323 (rótulo), Atkinson Hyperlegible (corpo).
- Toque ≥ 44px, um único botão dourado por tela, estados consistentes, respeitar reduced-motion.
- Já rejeitado (não repetir): árvore desenhada por código, vista "galho" por contexto, física de grafo que treme, materiais de madeira/pergaminho/ferro forjado.

## 4. Quality gate

Antes de declarar qualquer tarefa pronta, rodar e passar:

```bash
npx tsc --noEmit        # tipos: zero erros
npx expo lint           # lint: zero erros e zero avisos novos
npx expo-doctor         # dependências compatíveis com o SDK
```

```bash
node .claude/scripts/rn-rules-check.js   # regras das skills de React Native: zero ERRO
```

### Revisão pelas skills (parte do gate)
Duas skills ficam instaladas no projeto, em `.claude/skills/`:

| skill | papel | quando |
|---|---|---|
| `vercel-react-native-skills` (Vercel, MIT) | **regras de escrita**: listas, animação, navegação, UI, estado, renderização | **sempre** que escrever ou revisar componente ou tela |
| `react-native-best-practices` (Callstack, MIT) | **diagnóstico de desempenho**: medir → otimizar → medir de novo; bundle, TTI, memória | só quando houver problema medido (lentidão, travadas, memória) e na revisão de bundle ao fim da sprint |

Como a revisão entra no gate:
1. `rn-rules-check.js` confere de forma automática as regras mecânicas (Pressable, `expo-image`, native-stack, sem barrel, sem cor crua, ScrollView com `.map`, `&&` com número, `measure()`, animar fora de transform/opacity). **ERRO bloqueia; AVISO precisa de justificativa no relatório.**
2. Para cada categoria tocada na tarefa (lista, animação, navegação, UI, estado, renderização), a IA abre os arquivos de `rules/` correspondentes da skill da Vercel e confere o diff contra eles. O relatório final traz uma tabela curta: regra, ok ou motivo da exceção.
3. Otimização de desempenho (memo, `useCallback`, troca de estado) só com medição antes e depois, conforme a skill da Callstack. Sem medição, não otimizar.

### Onde as skills cedem ao projeto
| regra da skill | decisão do Bombaio |
|---|---|
| `navigation-native-navigators` (abas nativas) | **pilha nativa sim; abas com a `TabBar` em pixel art do Storybook**, que abas nativas não permitem. Navegador de abas JS com `tabBar` personalizado é exceção aceita |
| `ui-styling`: `borderCurve: 'continuous'` e cantos arredondados | não se aplica: pixel art usa cantos retos (raios do tema, 0 a 2px) |
| `imports-design-system-folder` | sim, telas importam de `src/components/`, mas **arquivo por arquivo** (`@/components/Button`), sem `index.ts` (regra `bundle-barrel-exports` da Callstack) |
| `list-performance-item-memo`, `callbacks` | obrigatórias em itens de lista; fora de listas, só com medição |
| `ui-expo-image`, `animation-gesture-detector-press` | adotadas; dependem de instalar `expo-image`, `react-native-gesture-handler` e `react-native-reanimated` quando a dupla autorizar |
| comandos `agent-device`, Xcode, R8, Turbo Modules (Callstack) | fora do escopo da disciplina; ignorar |

O `App.tsx` do template tem cores cruas e falha no checker até a Fase A1 da Sprint 3 substituí-lo; é o único erro esperado.

Quando houver testes (Jest + React Native Testing Library, a adicionar quando a dupla pedir): `npm test` verde, e toda regra de jogo nova (XP, níveis, faixas de validação, pontuação de domínio, escolha da árvore) nasce com teste antes da implementação.

Regras do gate:
- TypeScript em modo `strict`; sem `any`, sem `as` para forçar tipo, sem supressões (ver regra 1.7).
- Dependência nova só com `npx expo install` e só se pedida.
- Lógica de regra de jogo fica fora dos componentes (funções puras testáveis).
- Acessibilidade: todo elemento tocável tem `accessibilityRole` e `accessibilityLabel`; contraste mínimo 4.5:1.
- Se o gate falhar, relatar a saída real; nunca dizer "pronto" com gate vermelho.

## 5. Como trabalhar aqui

1. Ler este arquivo, o `AGENTS.md` e, se for UI, o `CLAUDE.md` do Storybook.
2. Para qualquer API do Expo/React Native, consultar a documentação da versão do SDK em `package.json` (o `AGENTS.md` explica). Não confiar na memória.
3. Fazer só o pedido, no menor passo útil.
4. Rodar o quality gate.
5. Commitar (regra 1.1, sem coautoria) e entregar: o que mudou, a saída do gate e o hash do commit. O push fica com a dupla.

## 6. Documentos do harness

- [`.claude/docs/sprint-3.md`](.claude/docs/sprint-3.md): divisão do front-end entre Lucas (componentes e estilo, primeiro) e Dudu (telas, navegação e estado, depois), fases, cenários de impasse e como reagir, padrão para criar componentes e telas. **Ler antes de implementar qualquer coisa da Sprint 3.**

## 7. Estado atual

- Template `blank-typescript` do `create-expo-app`, Expo SDK 58, React Native 0.88, React 19.3, TypeScript 6. O commit inicial veio do próprio gerador.
- Nenhum código do Bombaio ainda: sem navegação, telas, banco, assets ou fontes.
