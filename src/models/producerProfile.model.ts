import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';

export class ProducerProfile extends Model {
  public id!: number;
  public userId!: number;
  public energySource!: 'Fossile' | 'Eolico' | 'Fotovoltaico';
  public co2EmissionPerKwh!: number;
}

export const initProducerProfileModel = (sequelize: Sequelize): void => {
  ProducerProfile.init(
    {
      // ... attributi ...
    },
    {
      sequelize,
      tableName: 'ProducerProfiles',
    }
  );
};

export const associateProducerProfileModel = (): void => {
  ProducerProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};