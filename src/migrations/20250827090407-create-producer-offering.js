'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProducerOfferings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      producerProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProducerProfiles', // Nome della tabella
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hour: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      availableKwh: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      costPerKwh: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
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

    // Aggiungi un vincolo UNIQUE per evitare duplicati per la stessa ora/giorno/produttore
    await queryInterface.addConstraint('ProducerOfferings', {
      fields: ['producerProfileId', 'date', 'hour'],
      type: 'unique',
      name: 'unique_offering_constraint'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProducerOfferings');
  }
};