const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 19000;

app.use(cors());
app.use(express.json());

// Rota para verificar se o servidor está funcionando
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rota para servir o arquivo de teste
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mobile/web-test.html'));
});

// Iniciar o servidor
const server = createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor de teste rodando em http://0.0.0.0:${port}`);
  console.log(`Para testar em um dispositivo na mesma rede, use o IP da sua máquina`);
});
