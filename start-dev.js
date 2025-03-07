#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to local vite in node_modules
const vitePath = join(__dirname, 'node_modules', '.bin', 'vite');

// Spawn vite process
const viteProcess = spawn(vitePath, [], {
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start vite:', err);
});
