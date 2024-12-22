import { spawn, type Subprocess } from "bun";

async function startService(name: string, path: string): Promise<Subprocess> {
  const proc = spawn(["bun", path], {
    stdio: ["inherit", "pipe", "pipe"], // Pipe stdout and stderr so we can prefix them
    env: { ...process.env, FORCE_COLOR: "1" }
  });

  if (!proc.stdout || !proc.stderr) {
    console.error(`${name} streams not available`);
    process.exit(1);
  }

  // Prefix stdout
  proc.stdout.getReader().read().then(function process({value, done}) {
    if (!done && value) {
      const lines = new TextDecoder().decode(value).split('\n');
      lines.forEach(line => {
        if (line) console.log(`[${name}] ${line}`);
      });
    }
    if (!done) proc.stdout?.getReader().read().then(process);
  });

  // Prefix stderr
  proc.stderr.getReader().read().then(function process({value, done}) {
    if (!done && value) {
      const lines = new TextDecoder().decode(value).split('\n');
      lines.forEach(line => {
        if (line) console.error(`[${name}] ${line}`);
      });
    }
    if (!done) proc.stderr?.getReader().read().then(process);
  });

  if (!proc.pid) {
    console.error(`[${name}] Failed to start`);
    process.exit(1);
  }

  return proc;
}

// Start both services
const hubProc = await startService("hub", "src/hub/index.ts");
const apiProc = await startService("api", "src/api/index.ts");

// Handle process termination
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  hubProc.kill();
  apiProc.kill();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  hubProc.kill();
  apiProc.kill();
  process.exit(0);
});

console.log("🚀 All services started");