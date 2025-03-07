const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Verificando se já existe um usuário administrador...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (existingAdmin) {
      console.log('Usuário administrador já existe:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log('Senha: Use a senha definida durante a criação');
      return;
    }

    console.log('Criando novo usuário administrador...');
    
    // Create admin user with correct structure
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@fooddelivery.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
        admin: {
          create: {}
        }
      }
    });

    console.log('Usuário administrador criado com sucesso:');
    console.log(`Email: ${adminUser.email}`);
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    console.error('Detalhes do erro:', error.message);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
