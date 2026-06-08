import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(
  path.join(root, ".tools", "gemini", "node_modules", "package.json"),
);
const pty = require("node-pty");
const gemini = path.join(
  root,
  ".tools",
  "gemini",
  "node_modules",
  ".bin",
  "gemini.cmd",
);

const terminal = pty.spawn(process.env.ComSpec || "cmd.exe", ["/d", "/c", gemini], {
  cwd: root,
  cols: 120,
  rows: 40,
  env: {
    ...process.env,
    GEMINI_CLI_HOME: path.join(root, ".gemini-forja"),
    NO_BROWSER: "true",
  },
});

terminal.onData((data) => process.stdout.write(data));
terminal.onExit(({ exitCode }) => process.exit(exitCode));
