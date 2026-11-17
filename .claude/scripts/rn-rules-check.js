const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const targets = ["src", "App.tsx", "app"].map((p) => path.join(root, p)).filter((p) => fs.existsSync(p));
const files = [];
const walk = (p) => {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    if (/node_modules|\.expo|[\\/]dist$/.test(p)) return;
    fs.readdirSync(p).forEach((f) => walk(path.join(p, f)));
  } else if (/\.(tsx?|jsx?)$/.test(p) && !/\.test\.|\.spec\./.test(p)) files.push(p);
};
targets.forEach(walk);

const rules = [
  { id: "ui-pressable", skill: "vercel", level: "error", test: (s) => /\bTouchable(Opacity|Highlight|WithoutFeedback)\b/.test(s), msg: "use Pressable (ou GestureDetector para feedback animado), não Touchable*" },
  { id: "ui-expo-image", skill: "vercel", level: "error", test: (s) => /import\s*\{[^}]*\bImage\b[^}]*\}\s*from\s*['"]react-native['"]/.test(s), msg: "use Image de expo-image, não de react-native" },
  { id: "navigation-native-navigators", skill: "vercel", level: "error", test: (s) => /['"]@react-navigation\/stack['"]/.test(s), msg: "use native-stack (ou a Stack do Expo Router), não @react-navigation/stack" },
  { id: "list-performance-virtualize", skill: "vercel + callstack", level: "warn", test: (s) => /<ScrollView[\s\S]*\.map\(/.test(s), msg: "ScrollView com .map: se a lista pode crescer, use FlatList/FlashList" },
  { id: "rendering-no-falsy-and", skill: "vercel", level: "warn", test: (s) => /\{\s*[\w.?]+(\.length|count|Count|total|Total)\s*&&\s*</.test(s), msg: "número && <JSX> pode renderizar 0 fora de <Text> e quebrar; use ternário ou comparação explícita" },
  { id: "ui-measure-views", skill: "vercel", level: "warn", test: (s) => /\.measure(InWindow)?\(/.test(s), msg: "prefira onLayout a measure()" },
  { id: "bundle-barrel-exports", skill: "callstack", level: "error", test: (s) => /from\s*['"](@\/components|(\.\.?\/)+components)['"]/.test(s), msg: "import direto do arquivo do componente (@/components/Button), sem barrel" },
  { id: "projeto-tokens", skill: "harness", level: "error", file: (f) => !/[\\/]src[\\/]theme[\\/]/.test(f), test: (s) => /['"]#[0-9a-fA-F]{3,8}['"]|rgba?\(/.test(s), msg: "cor crua fora de src/theme; use os tokens" },
  { id: "animation-gpu-properties", skill: "vercel", level: "warn", test: (s) => /useAnimatedStyle\([\s\S]*?\b(width|height|top|left|margin\w*|padding\w*)\s*:/.test(s), msg: "animar só transform e opacity" },
];

const barrel = path.join(root, "src", "components", "index.ts");
const findings = [];
if (fs.existsSync(barrel)) findings.push({ level: "error", id: "bundle-barrel-exports", skill: "callstack", file: barrel, msg: "não criar src/components/index.ts" });

files.forEach((f) => {
  const src = fs.readFileSync(f, "utf8");
  rules.forEach((r) => {
    if (r.file && !r.file(f)) return;
    if (r.test(src)) findings.push({ level: r.level, id: r.id, skill: r.skill, file: f, msg: r.msg });
  });
});

const rel = (f) => path.relative(root, f);
findings.forEach((x) => console.log(`${x.level === "error" ? "ERRO " : "AVISO"} [${x.id} · ${x.skill}] ${rel(x.file)}: ${x.msg}`));
const errors = findings.filter((x) => x.level === "error").length;
console.log(`\n${files.length} arquivos, ${errors} erro(s), ${findings.length - errors} aviso(s).`);
process.exit(errors ? 1 : 0);
