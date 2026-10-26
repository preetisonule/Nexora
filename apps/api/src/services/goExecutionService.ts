import { spawn, exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { ICodeRunResult } from '@compilo/shared';

export interface ExecutionOptions {
  code: string;
  stdin?: string;
  timeoutMs?: number;
}

export class GoExecutionService {
  private static binaryPath: string = config.go.binaryPath;

  public static async execute(options: ExecutionOptions): Promise<ICodeRunResult> {
    const { code, stdin = '', timeoutMs = config.go.timeoutMs } = options;

    if (!code || typeof code !== 'string') {
      return {
        stdout: '',
        stderr: 'No Go code provided for execution.',
        exitCode: 1,
        executionTimeMs: 0,
        compileError: 'No code provided',
        timedOut: false,
      };
    }

    // Ephemeral directory creation
    const tempDirName = `compilo-go-${uuidv4()}`;
    const tempDirPath = path.join(os.tmpdir(), tempDirName);
    const mainFilePath = path.join(tempDirPath, 'main.go');

    const startTime = Date.now();

    try {
      await fs.mkdir(tempDirPath, { recursive: true });
      await fs.writeFile(mainFilePath, code, 'utf-8');

      return await new Promise<ICodeRunResult>((resolve) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let isClosed = false;

        // Spawn isolated go process
        const child = spawn(this.binaryPath, ['run', 'main.go'], {
          cwd: tempDirPath,
          windowsHide: true,
        });

        // Set timeout killer with process tree kill on Windows
        const timer = setTimeout(() => {
          if (!isClosed) {
            timedOut = true;
            if (process.platform === 'win32' && child.pid) {
              exec(`taskkill /pid ${child.pid} /T /F`, () => {});
            } else {
              child.kill('SIGKILL');
            }
          }
        }, timeoutMs);

        // Pipe stdin if provided
        if (stdin) {
          try {
            child.stdin.write(stdin);
            child.stdin.end();
          } catch {
            // Ignore
          }
        } else {
          child.stdin.end();
        }

        // Buffer outputs up to max size
        child.stdout.on('data', (chunk) => {
          if (stdout.length + chunk.length <= config.go.maxOutputBytes) {
            stdout += chunk.toString();
          } else if (stdout.length < config.go.maxOutputBytes) {
            stdout += chunk.toString().slice(0, config.go.maxOutputBytes - stdout.length) + '\n[Output truncated...]';
          }
        });

        child.stderr.on('data', (chunk) => {
          if (stderr.length + chunk.length <= config.go.maxOutputBytes) {
            stderr += chunk.toString();
          } else if (stderr.length < config.go.maxOutputBytes) {
            stderr += chunk.toString().slice(0, config.go.maxOutputBytes - stderr.length) + '\n[Error output truncated...]';
          }
        });

        child.on('error', (err) => {
          isClosed = true;
          clearTimeout(timer);
          const executionTimeMs = Date.now() - startTime;
          resolve({
            stdout: '',
            stderr: `Compiler process error: ${err.message}`,
            exitCode: -1,
            executionTimeMs,
            compileError: err.message,
            timedOut: false,
          });
        });

        child.on('close', (code) => {
          isClosed = true;
          clearTimeout(timer);
          const executionTimeMs = Date.now() - startTime;

          // Parse compile or runtime error
          let compileError: string | undefined;
          let runtimeError: string | undefined;

          // Normalize error paths for clean user display
          const cleanedStderr = stderr
            .replace(new RegExp(mainFilePath.replace(/\\/g, '\\\\'), 'g'), 'main.go')
            .replace(new RegExp(tempDirPath.replace(/\\/g, '\\\\'), 'g'), '');

          if (timedOut) {
            runtimeError = `Time Limit Exceeded: Execution took longer than ${timeoutMs}ms limit.`;
          } else if (code !== 0) {
            if (
              cleanedStderr.includes('syntax error') ||
              cleanedStderr.includes('undefined:') ||
              cleanedStderr.includes('imported and not used') ||
              cleanedStderr.includes('expected') ||
              cleanedStderr.includes('cannot use')
            ) {
              compileError = cleanedStderr;
            } else {
              runtimeError = cleanedStderr || `Process exited with error code ${code}`;
            }
          }

          resolve({
            stdout,
            stderr: cleanedStderr,
            exitCode: timedOut ? 124 : (code ?? -1),
            executionTimeMs,
            compileError,
            runtimeError,
            timedOut,
          });
        });
      });
    } catch (err: any) {
      return {
        stdout: '',
        stderr: `Execution workspace setup error: ${err.message}`,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        compileError: err.message,
        timedOut: false,
      };
    } finally {
      // Ephemeral workspace cleanup
      try {
        await fs.rm(tempDirPath, { recursive: true, force: true });
      } catch {
        // Silently continue if OS locks temporary cleanup briefly
      }
    }
  }
}
