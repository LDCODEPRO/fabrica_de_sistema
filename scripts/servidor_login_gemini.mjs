import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(
  path.join(root, ".tools", "gemini", "node_modules", "package.json"),
);
const pty = require("node-pty");
const port = 8765;

let authUrl = "";
let status = "Preparando autenticação...";
let output = "";
let terminalActive = true;
const logPath = path.join(root, "logs", "gemini-login.log");
fs.mkdirSync(path.dirname(logPath), { recursive: true });

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
}

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
  cols: 140,
  rows: 40,
  env: {
    ...process.env,
    GEMINI_CLI_HOME: path.join(root, ".gemini-forja"),
    NO_BROWSER: "true",
  },
});

terminal.onData((data) => {
  output = (output + data).replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "");
  const match = output.match(/https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\?[^\s]+/);
  if (match) {
    authUrl = match[0];
    status = "Pronto para conectar.";
  }
  if (/authenticated|authentication successful|ready/i.test(output)) {
    status = "Gemini conectado com sucesso.";
    log("AUTH_SUCCESS");
  }
  const errorLine = output.match(/(?:error|failed|invalid)[^\r\n]*/i);
  if (errorLine) {
    status = `Falha na autenticação: ${errorLine[0]
      .replace(/https?:\/\/\S+/g, "[endereço ocultado]")
      .slice(0, 180)}`;
    log("AUTH_FAILURE");
  }
});

terminal.onExit(({ exitCode }) => {
  terminalActive = false;
  if (exitCode !== 0 && !/conectado com sucesso/i.test(status)) {
    status = "A autenticação foi encerrada. Reabra esta página para tentar novamente.";
    log(`TERMINAL_EXIT code=${exitCode}`);
  }
});

function page(message = "") {
  const action = authUrl
    ? `<a class="primary" href="${authUrl}" target="_blank" rel="noopener">Entrar com Google</a>`
    : `<button class="primary" disabled>Aguarde...</button>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>FORJA OS - Conectar Gemini</title>
<style>
body{margin:0;font-family:Segoe UI,Arial,sans-serif;background:#111827;color:#f9fafb;display:grid;place-items:center;min-height:100vh}
main{width:min(560px,calc(100% - 32px));background:#1f2937;border:1px solid #374151;padding:28px;border-radius:8px}
h1{font-size:24px;margin:0 0 10px}p{color:#d1d5db;line-height:1.5}
.status{background:#111827;border-left:4px solid #10b981;padding:12px;margin:20px 0}
.primary,button{display:inline-block;background:#2563eb;color:white;border:0;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:600;cursor:pointer}
label{display:block;margin:24px 0 8px;font-weight:600}input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #4b5563;border-radius:6px;background:#111827;color:white}
form button{margin-top:12px}.note{font-size:13px}.message{color:#86efac}
</style>
</head>
<body><main>
<h1>Conectar assinatura Gemini</h1>
<p>Use a conta Google vinculada à sua assinatura. A senha nunca passa pela FORJA OS.</p>
<div class="status">${status}</div>
${message ? `<p class="message">${message}</p>` : ""}
${action}
<form method="post" action="/codigo">
<label for="codigo">Código fornecido pelo Google</label>
<input id="codigo" name="codigo" autocomplete="off" required>
<button type="submit">Concluir conexão</button>
</form>
<p class="note">Esta página funciona somente nesta máquina, pelo endereço 127.0.0.1.</p>
</main></body></html>`;
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/codigo") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8192) req.destroy();
    });
    req.on("end", () => {
      const code = new URLSearchParams(body).get("codigo")?.trim() || "";
      if (code && terminalActive) {
        terminal.write(`${code}\r`);
        status = "Validando o código com o Google...";
        log("CODE_SUBMITTED");
      } else if (!terminalActive) {
        status = "O código expirou. Reinicie a conexão para gerar uma nova autorização.";
      }
      res.writeHead(303, { Location: "/" });
      res.end();
    });
    return;
  }
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(page());
});

server.on("error", (error) => log(`SERVER_ERROR ${error.code || "UNKNOWN"}`));
server.listen(port, "127.0.0.1", () => log(`SERVER_READY port=${port}`));
