const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createCustomerUser() {
  try {
    // Check if customer user already exists
    const existingCustomer = await prisma.user.findFirst({
      where: {
        role: 'CUSTOMER'
      }
    });

    if (existingCustomer) {
      console.log('Customer user already exists:');
      console.log(`Email: ${existingCustomer.email}`);
      console.log('Password: Use the password you set during creation');
      return;
    }

    // Create customer user
    const hashedPassword = await bcrypt.hash('customer123', 10);
    
    const customerUser = await prisma.user.create({
      data: {
        email: 'customer@fooddelivery.com',
        password: hashedPassword,
        name: 'Cliente Exemplo',
        role: 'CUSTOMER',
        customer: {
          create: {
            address: 'Rua do Cliente, 456',
            phone: '(11) 88888-8888'
          }
        }
      },
      include: {
        customer: true
      }
    });

    console.log('Customer user created successfully:');
    console.log(`Email: ${customerUser.email}`);
    console.log('Password: customer123');
    
  } catch (error) {
    console.error('Error creating customer user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCustomerUser();
