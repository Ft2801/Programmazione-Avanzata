// runtime require for sequelize types to avoid editor type resolution issues
const SequelizePkg: any = require('sequelize');
const Model: any = SequelizePkg.Model;
const DataTypes: any = SequelizePkg.DataTypes;
import { User } from './user.model';

export class ConsumerProfile extends (Model as any) {
  public id!: number;
  public userId!: number;
  public creditBalance!: number;
}

export const initConsumerProfileModel = (sequelize: any): void => {
  (ConsumerProfile as any).init(
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
  (ConsumerProfile as any).belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};