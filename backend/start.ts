import { spawn, type ChildProcess } from 'child_process';

// Configuration
const processes = [
    { name: 'hub', command: 'bun', args: ['src/hub/index.ts'] },
    { name: 'router', command: 'bun', args: ['src/api/index.ts'] }
];

// Store process references
const runningProcesses: ChildProcess[] = [];

// Function to start a single process
function startProcess(name: string, command: string, args: string[]) {
    const process = spawn(command, args, {
        stdio: 'inherit',
        shell: true
    });

    runningProcesses.push(process);

    process.on('error', (err) => {
        console.error(`Failed to start ${name}:`, err);
    });

    process.on('exit', (code, signal) => {
        if (code !== 0) {
            console.error(`${name} exited with code ${code}, signal: ${signal}`);
        }
    });

    return process;
}

// Function to cleanup processes
function cleanup() {
    console.log('\nShutting down processes...');
    runningProcesses.forEach(process => {
        process.kill();
    });
}

// Handle interrupts
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start all processes
console.log('Starting processes...');
processes.forEach(({ name, command, args }) => {
    console.log(`Starting ${name}...`);
    startProcess(name, command, args);
});