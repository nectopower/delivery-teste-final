const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createRestaurantUser() {
  try {
    // Check if restaurant user already exists
    const existingRestaurant = await prisma.user.findFirst({
      where: {
        role: 'RESTAURANT'
      }
    });

    if (existingRestaurant) {
      console.log('Restaurant user already exists:');
      console.log(`Email: ${existingRestaurant.email}`);
      console.log('Password: Use the password you set during creation');
      return;
    }

    // Create restaurant user
    const hashedPassword = await bcrypt.hash('restaurant123', 10);
    
    const restaurantUser = await prisma.user.create({
      data: {
        email: 'restaurant@fooddelivery.com',
        password: hashedPassword,
        name: 'Restaurante Exemplo',
        role: 'RESTAURANT',
        restaurant: {
          create: {
            name: 'Restaurante Exemplo',
            description: 'Um restaurante de exemplo para testes',
            address: 'Rua Exemplo, 123',
            phone: '(11) 99999-9999',
            logo: 'https://via.placeholder.com/150',
            isApproved: true
          }
        }
      },
      include: {
        restaurant: true
      }
    });

    console.log('Restaurant user created successfully:');
    console.log(`Email: ${restaurantUser.email}`);
    console.log('Password: restaurant123');
    
  } catch (error) {
    console.error('Error creating restaurant user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRestaurantUser();
