# Bombaio · App (harness)

Leia este arquivo inteiro antes de qualquer trabalho neste repositório. Ele vale sobre qualquer hábito ou padrão do agente. O `AGENTS.md` (gerado pelo Expo) complementa este arquivo nas questões técnicas do Expo; se os dois divergirem, **este arquivo manda**.

## 1. Regras invioláveis (a IA nunca quebra)

1. **A IA não commita.** Proibido `git commit`, `git push`, `git merge`, `git rebase`, `git reset`, `git tag`, `git stash`, `git checkout -- <arquivo>`, `git restore`, `git cherry-pick`, `git revert` ou qualquer comando que grave ou reescreva o histórico ou descarte trabalho. Quem commita é a dupla. A IA pode **ler** o git (`status`, `diff`, `log`, `show`, `blame`) e, ao terminar, sugerir uma mensagem de commit em texto. Bloqueado também por hook (`.claude/hooks/block-git.js`).
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
5. Entregar: o que mudou, a saída do gate e uma **sugestão** de mensagem de commit. A dupla commita.

## 6. Estado atual

- Template `blank-typescript` do `create-expo-app`, Expo SDK 58, React Native 0.88, React 19.3, TypeScript 6. O commit inicial veio do próprio gerador.
- Nenhum código do Bombaio ainda: sem navegação, telas, banco, assets ou fontes.
