// runtime require for sequelize to avoid editor type-resolution issues
const SequelizePkg: any = require('sequelize');
const Model: any = SequelizePkg.Model;
const DataTypes: any = SequelizePkg.DataTypes;
import { ProducerProfile } from './producerProfile.model';

export class ProducerOffering extends (Model as any) {
  public id!: number;
  public producerProfileId!: number;
  public date!: string; // YYYY-MM-DD
  public hour!: number; // 0-23
  public availableKwh!: number;
  public costPerKwh!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initProducerOfferingModel = (sequelize: any): void => {
  (ProducerOffering as any).init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      producerProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 23,
        },
      },
      availableKwh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      costPerKwh: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      tableName: 'ProducerOfferings',
      indexes: [
        {
          unique: true,
          fields: ['producerProfileId', 'date', 'hour'],
        },
      ],
    }
  );
};

// Aggiungi associazioni
export const associateProducerOfferingModel = (): void => {
  (ProducerOffering as any).belongsTo(ProducerProfile, {
    foreignKey: 'producerProfileId',
    as: 'producerProfile',
  });
};