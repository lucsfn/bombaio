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
  const forbidden = /\bgit\b[^|;&\n]*?\b(commit|push|merge|rebase|reset|tag|stash|cherry-pick|revert|restore|am|apply|filter-branch|update-ref|clean)\b|\bgit\b[^|;&\n]*?\bcheckout\b[^|;&\n]*\s--(\s|$)/i;
  if (forbidden.test(command)) {
    process.stderr.write(
      "Bloqueado pelo harness do Bombaio: a IA não commita nem reescreve o histórico (CLAUDE.md, regra 1.1). Termine a tarefa e sugira a mensagem de commit em texto; a dupla commita."
    );
    process.exit(2);
  }
  process.exit(0);
});
