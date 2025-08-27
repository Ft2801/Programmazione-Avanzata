'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProducerOffering extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProducerOffering.init({
    producerProfileId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    hour: DataTypes.INTEGER,
    availableKwh: DataTypes.DECIMAL,
    costPerKwh: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'ProducerOffering',
  });
  return ProducerOffering;
};