const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  let input = {};
  try {
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    process.exit(0);
  }
  const command = String((input.tool_input && input.tool_input.command) || "");
  const block = (why) => {
    process.stderr.write("Bloqueado pelo harness do Bombaio (CLAUDE.md, regra 1.1): " + why);
    process.exit(2);
  };
  if (!/\bgit\b/i.test(command)) process.exit(0);

  const forbidden = /\bgit\b[^|;&\n]*?\b(push|merge|rebase|reset|tag|stash|cherry-pick|revert|restore|am|apply|filter-branch|filter-repo|update-ref|clean|replace|notes)\b|\bgit\b[^|;&\n]*?\bcheckout\b[^|;&\n]*\s--(\s|$)/i;
  if (forbidden.test(command)) block("a IA não publica, não reescreve histórico e não descarta trabalho. Push e afins ficam com a dupla.");

  if (/\bgit(\s+-{1,2}[\w-]+(=\S+|\s+[^-\s]\S*)?)*\s+config\b/i.test(command) && !/\bconfig\b[^|;&\n]*\s(--get|--list|-l)\b/i.test(command)) block("a IA não altera o git config.");
  if (/\bgit\s+-c\s+user\./i.test(command)) block("a IA não sobrescreve a identidade do autor.");

  if (/\bgit\b[^|;&\n]*\bcommit\b/i.test(command)) {
    if (/--amend|--no-verify|(^|\s)-n(\s|$)|--author|(^|\s)-F(\s|$)|--file\b|--template\b/i.test(command)) block("commit só com -m, sem --amend, --no-verify, --author ou mensagem de arquivo.");
    if (/co-authored-by|noreply@anthropic|generated with|claude code|\bclaude\s+(opus|sonnet|haiku|fable)\b|🤖/i.test(command)) block("proibido atribuir o commit ao modelo. Remova Co-Authored-By e qualquer menção à IA; o histórico mostra só o nome da pessoa.");
  }
  process.exit(0);
});
