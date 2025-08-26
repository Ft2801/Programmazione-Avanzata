'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProducerProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProducerProfile.init({
    userId: DataTypes.INTEGER,
    energySource: DataTypes.STRING,
    co2EmissionPerKwh: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ProducerProfile',
  });
  return ProducerProfile;
};