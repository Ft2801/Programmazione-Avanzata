import dotenv from 'dotenv';
dotenv.config();

// Import our configured sequelize (Postgres) and TypeScript model initializers
// Use ES import style so ts-node resolves the .ts files, not the compiled index.js
import sequelize from '../src/config/database';
// require the TypeScript models file explicitly so we get the TS exports (not compiled index.js)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const models = require('../src/models/index.ts');
const { initModels, User, ProducerProfile, ConsumerProfile, ProducerOffering, Booking } = models;

(async () => {
  try {
    console.log('Starting seed...');
    // Initialize models (TypeScript initModels) with our configured sequelize instance
    initModels(sequelize);
    await sequelize.authenticate();
    console.log('DB connected');

    // Force sync to create fresh tables
    await sequelize.sync({ force: true });
    console.log('DB synced (force: true)');

    // Create a producer user
    const producerUser = await User.create({
      name: 'Producer One',
      email: 'producer1@example.com',
      password: 'password123',
      role: 'producer',
    });

    // Create a consumer user
    const consumerUser = await User.create({
      name: 'Consumer One',
      email: 'consumer1@example.com',
      password: 'password123',
      role: 'consumer',
    });

    // Producer profile
    const producerProfile = await ProducerProfile.create({
      userId: producerUser.id,
      energySource: 'Fotovoltaico',
      co2EmissionPerKwh: 0.0,
    });

    // Consumer profile
    const consumerProfile = await ConsumerProfile.create({
      userId: consumerUser.id,
      creditBalance: 100.0,
    });

    // Producer offerings for tomorrow hours 12 and 13
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const offering1 = await ProducerOffering.create({
      producerProfileId: producerProfile.id,
      date: dateStr,
      hour: 12,
      availableKwh: 10.0,
      costPerKwh: 0.25,
    });

    const offering2 = await ProducerOffering.create({
      producerProfileId: producerProfile.id,
      date: dateStr,
      hour: 13,
      availableKwh: 8.0,
      costPerKwh: 0.22,
    });

    // Create a booking for consumer on offering1
    const booking = await Booking.create({
      consumerProfileId: consumerProfile.id,
      producerOfferingId: offering1.id,
      slotDateTime: new Date(`${dateStr}T12:00:00Z`),
      requestedKwh: 2.5,
      totalCost: 2.5 * Number(offering1.costPerKwh),
      status: 'pending',
    });

    console.log('Seed complete:', { producerUser: producerUser.id, consumerUser: consumerUser.id, booking: booking.id });
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
