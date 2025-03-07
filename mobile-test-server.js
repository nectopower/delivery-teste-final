import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the mobile directory
app.use(express.static(join(__dirname, 'mobile')));

// Mock data
const restaurants = [
  {
    id: '1',
    name: 'Restaurante Brasileiro',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.7,
    ratingCount: 253,
    deliveryTime: 30,
    deliveryFee: 5.99,
    categories: [{ id: '1', name: 'Brasileira' }, { id: '2', name: 'Tradicional' }]
  },
  {
    id: '2',
    name: 'Pizza Express',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.5,
    ratingCount: 187,
    deliveryTime: 25,
    deliveryFee: 4.99,
    categories: [{ id: '3', name: 'Pizza' }, { id: '4', name: 'Italiana' }]
  },
  {
    id: '3',
    name: 'Sushi Delícia',
    imageUrl: 'https://via.placeholder.com/150',
    rating: 4.8,
    ratingCount: 312,
    deliveryTime: 40,
    deliveryFee: 7.99,
    categories: [{ id: '5', name: 'Japonesa' }, { id: '6', name: 'Sushi' }]
  }
];

// API routes
app.get('/api/restaurants', (req, res) => {
  res.json(restaurants);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email === 'user@example.com' && password === 'password') {
    res.json({
      id: '1',
      name: 'Usuário Teste',
      email: 'user@example.com',
      phone: '(11) 98765-4321',
      token: 'mock-jwt-token'
    });
  } else {
    res.status(401).json({ message: 'Email ou senha incorretos' });
  }
});

// Create a simple web-based test interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Teste do App de Delivery</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .screen {
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .button {
          background-color: #FF4500;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }
        .input {
          padding: 8px;
          margin: 5px 0;
          width: 100%;
          box-sizing: border-box;
        }
        .restaurant {
          display: flex;
          border: 1px solid #eee;
          margin: 10px 0;
          padding: 10px;
          border-radius: 5px;
        }
        .restaurant img {
          width: 80px;
          height: 80px;
          margin-right: 15px;
        }
      </style>
    </head>
    <body>
      <h1>Teste do App de Delivery</h1>
      <p>Esta é uma interface web simples para testar as funcionalidades do app móvel.</p>
      
      <div class="screen">
        <h2>Login</h2>
        <input type="email" id="email" placeholder="Email" class="input" value="user@example.com">
        <input type="password" id="password" placeholder="Senha" class="input" value="password">
        <button class="button" onclick="login()">Entrar</button>
        <div id="loginResult"></div>
      </div>
      
      <div class="screen">
        <h2>Restaurantes</h2>
        <button class="button" onclick="loadRestaurants()">Carregar Restaurantes</button>
        <div id="restaurantsList"></div>
      </div>
      
      <script>
        async function login() {
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              document.getElementById('loginResult').innerHTML = 
                \`<p style="color: green">Login bem-sucedido! Bem-vindo, \${data.name}</p>\`;
              localStorage.setItem('userToken', data.token);
            } else {
              document.getElementById('loginResult').innerHTML = 
                \`<p style="color: red">\${data.message}</p>\`;
            }
          } catch (error) {
            document.getElementById('loginResult').innerHTML = 
              \`<p style="color: red">Erro ao fazer login: \${error.message}</p>\`;
          }
        }
        
        async function loadRestaurants() {
          try {
            const response = await fetch('/api/restaurants');
            const restaurants = await response.json();
            
            const restaurantsList = document.getElementById('restaurantsList');
            restaurantsList.innerHTML = '';
            
            restaurants.forEach(restaurant => {
              restaurantsList.innerHTML += \`
                <div class="restaurant">
                  <img src="\${restaurant.imageUrl}" alt="\${restaurant.name}">
                  <div>
                    <h3>\${restaurant.name}</h3>
                    <p>⭐ \${restaurant.rating} (\${restaurant.ratingCount} avaliações)</p>
                    <p>Tempo de entrega: \${restaurant.deliveryTime} min • Taxa: R$ \${restaurant.deliveryFee.toFixed(2)}</p>
                    <p>Categorias: \${restaurant.categories.map(c => c.name).join(', ')}</p>
                  </div>
                </div>
              \`;
            });
          } catch (error) {
            document.getElementById('restaurantsList').innerHTML = 
              \`<p style="color: red">Erro ao carregar restaurantes: \${error.message}</p>\`;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Servidor de teste rodando em http://localhost:${port}`);
  console.log(`Acesse http://localhost:${port} no seu navegador para testar as funcionalidades`);
});
