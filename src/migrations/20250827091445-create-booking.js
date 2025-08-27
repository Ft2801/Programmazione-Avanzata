'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consumerProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ConsumerProfiles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      producerOfferingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ProducerOfferings', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Non cancellare un'offerta se ha prenotazioni
      },
      slotDateTime: {
        type: Sequelize.DATE, // Es. 2025-07-07 15:00:00
        allowNull: false
      },
      requestedKwh: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      allocatedKwh: { // Nuovo campo come da progettazione
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true // Inizialmente è nullo
      },
      totalCost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled_in_time', 'cancelled_late'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Vincolo: un consumatore può prenotare solo una volta per una data fascia oraria
    await queryInterface.addConstraint('Bookings', {
      fields: ['consumerProfileId', 'slotDateTime'],
      type: 'unique',
      name: 'unique_consumer_slot_booking'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};