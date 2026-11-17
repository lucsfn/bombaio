const chunks = [];
process.stdin.on("data", (c) => chunks.push(c));
process.stdin.on("end", () => {
  let input = {};
  try {
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    process.exit(0);
  }
  const t = input.tool_input || {};
  const file = String(t.file_path || "");
  if (!/\.(tsx?|jsx?|mjs|cjs)$/i.test(file) || /[\\/]\.claude[\\/]/.test(file)) process.exit(0);
  const text = [t.content, t.new_string].filter(Boolean).join("\n");
  const stripped = text
    .replace(/`(?:\\[\s\S]|[^`\\])*`/g, "``")
    .replace(/"(?:\\.|[^"\\\n])*"/g, '""')
    .replace(/'(?:\\.|[^'\\\n])*'/g, "''")
    .replace(/https?:\/\/\S+/g, "");
  if (/(^|[^:\\])\/\/|\/\*/.test(stripped)) {
    process.stderr.write(
      "Bloqueado pelo harness do Bombaio: a IA não escreve comentários no código (CLAUDE.md, regra 1.2). Remova os comentários; contexto e decisões vão no CLAUDE.md, em docs/ ou na conversa."
    );
    process.exit(2);
  }
  process.exit(0);
});
