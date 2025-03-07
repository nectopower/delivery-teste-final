import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para executar comandos em paralelo
async function runCommands() {
  console.log('Iniciando servidor Expo e servidor QR Code...');

  // Inicia o Expo em modo offline
  const expoProcess = spawn('node', ['run-mobile-test.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Aguarda um pouco para o Expo iniciar
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Inicia o servidor QR Code
  const qrServerProcess = spawn('node', ['mobile/test-app.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Gerencia o encerramento dos processos
  process.on('SIGINT', () => {
    console.log('Encerrando processos...');
    expoProcess.kill();
    qrServerProcess.kill();
    process.exit();
  });

  expoProcess.on('error', (err) => {
    console.error('Erro ao iniciar o Expo:', err);
  });

  qrServerProcess.on('error', (err) => {
    console.error('Erro ao iniciar o servidor QR Code:', err);
  });
}

runCommands().catch(err => {
  console.error('Erro ao executar comandos:', err);
  process.exit(1);
});
