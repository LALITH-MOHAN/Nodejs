import sequelize from './config/db.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import CartItem from './models/cartItemModel.js';
import Order from './models/orderModel.js';
import OrderItem from './models/orderItemModel.js';

async function syncDatabase() {
  try {
    // Import all models to register them with Sequelize
    const models = {
      User,
      Product,
      CartItem,
      Order,
      OrderItem
    };

    // Set up associations
    Object.values(models).forEach(model => {
      if (model.associate) {
        model.associate(models);
      }
    });

    // Test the connection
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