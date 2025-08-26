import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user.model';

export class ConsumerProfile extends Model {
  public id!: number;
  public userId!: number;
  public creditBalance!: number;
}

export const initConsumerProfileModel = (sequelize: Sequelize): void => {
  ConsumerProfile.init(
    {
      // ... attributi ...
    },
    {
      sequelize,
      tableName: 'ConsumerProfiles',
    }
  );
};

export const associateConsumerProfileModel = (): void => {
  ConsumerProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};