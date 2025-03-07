import { createServer } from 'http';
import express from 'express';
import qrcode from 'qrcode';
import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3333;

// Obter o endereço IP da máquina
const getLocalIpAddress = () => {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Pular interfaces não IPv4 e interfaces de loopback/interno
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  
  // Retornar o primeiro IP encontrado ou localhost
  for (const name of Object.keys(results)) {
    if (results[name].length > 0) {
      return results[name][0];
    }
  }
  return '127.0.0.1';
};

const localIp = getLocalIpAddress();
const expoUrl = `exp://u.expo.dev/update/123456789`;

app.get('/', async (req, res) => {
  try {
    const qrImageUrl = await qrcode.toDataURL(expoUrl);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expo QR Code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 90%;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
            margin-bottom: 20px;
          }
          .url {
            word-break: break-all;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Expo QR Code</h1>
          <p>Escaneie este QR code com o aplicativo Expo Go no seu celular para testar o app:</p>
          <img src="${qrImageUrl}" alt="Expo QR Code">
          <p>Ou acesse diretamente esta URL no Expo Go:</p>
          <div class="url">${expoUrl}</div>
          <p>Certifique-se de que o Expo está rodando com o comando: <code>npx expo start --tunnel</code></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    res.status(500).send('Erro ao gerar QR code');
  }
});

const server = createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor QR Code rodando em http://${localIp}:${port}`);
  console.log(`Acesse http://${localIp}:${port} no seu navegador para ver o QR code`);
});
