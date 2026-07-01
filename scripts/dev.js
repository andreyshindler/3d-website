const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "..", "logs");
fs.mkdirSync(logsDir, { recursive: true });

function currentDate() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jerusalem" }); // "2026-06-28"
}

function ts() {
  return new Date().toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

let activeDate = currentDate();
let logStream = fs.createWriteStream(path.join(logsDir, `${activeDate}.log`), { flags: "a" });

function getStream() {
  const today = currentDate();
  if (today !== activeDate) {
    logStream.end();
    activeDate = today;
    logStream = fs.createWriteStream(path.join(logsDir, `${activeDate}.log`), { flags: "a" });
  }
  return logStream;
}

function writeLine(line) {
  const stamped = `[${ts()}] ${line}`;
  process.stdout.write(stamped + "\n");
  getStream().write(stamped + "\n");
}

const proc = spawn("npx", ["next", "dev"], {
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
});

let stdoutBuf = "";
proc.stdout.on("data", (chunk) => {
  stdoutBuf += chunk.toString();
  const lines = stdoutBuf.split("\n");
  stdoutBuf = lines.pop();
  lines.forEach(writeLine);
});

let stderrBuf = "";
proc.stderr.on("data", (chunk) => {
  stderrBuf += chunk.toString();
  const lines = stderrBuf.split("\n");
  stderrBuf = lines.pop();
  lines.forEach(writeLine);
});

proc.on("close", (code) => {
  if (stdoutBuf) writeLine(stdoutBuf);
  if (stderrBuf) writeLine(stderrBuf);
  logStream.end();
  process.exit(code ?? 0);
});
