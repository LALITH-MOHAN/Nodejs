import { sequelize, User, Product, CartItem, Order, OrderItem } from './models/index.js';

async function syncDatabase() {
  try {
    // Test the connection first
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync with force: true to drop and recreate tables
    await sequelize.sync({ force: true });
    console.log('All tables were synchronized successfully.');

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '$2b$10$uoMo3Z.MYsFOAB4emyTWxemQOG9D1pyW.v5yUR/pyZ.WSnDOukvb2',
      role: 'admin'
    });
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Unable to sync database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();