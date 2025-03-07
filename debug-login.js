const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugLogin() {
  try {
    const email = 'admin@fooddelivery.com';
    console.log(`Verificando usuário com email: ${email}`);
    
    // Find the user
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { admin: true }
    });
    
    if (!user) {
      console.log('Usuário não encontrado!');
      return;
    }
    
    console.log('Usuário encontrado:');
    console.log(`ID: ${user.id}`);
    console.log(`Nome: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Função: ${user.role}`);
    console.log(`Admin ID: ${user.admin ? user.admin.id : 'N/A'}`);
    
    // Test password
    const testPassword = 'admin123';
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log(`Senha 'admin123' corresponde: ${passwordMatch ? 'SIM' : 'NÃO'}`);
    
  } catch (error) {
    console.error('Erro ao depurar login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
