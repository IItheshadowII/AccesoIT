require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: 'admin@accesoit.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Usuario administrador creado exitosamente');
    console.log('Email: admin@accesoit.com');
    console.log('Password: admin123');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
