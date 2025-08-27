// runtime require for sequelize to avoid editor/type issues
const SequelizePkg: any = require('sequelize');
const Model: any = SequelizePkg.Model;
const DataTypes: any = SequelizePkg.DataTypes;
import { ConsumerProfile } from './consumerProfile.model';
import { ProducerOffering } from './producerOffering.model';

export class Booking extends (Model as any) {
  public id!: number;
  public consumerProfileId!: number;
  public producerOfferingId!: number;
  public slotDateTime!: Date;
  public requestedKwh!: number;
  public allocatedKwh?: number | null;
  public totalCost!: number;
  public status!: 'pending' | 'confirmed' | 'cancelled_in_time' | 'cancelled_late';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initBookingModel = (sequelize: any): void => {
  (Booking as any).init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      consumerProfileId: { type: DataTypes.INTEGER, allowNull: false },
      producerOfferingId: { type: DataTypes.INTEGER, allowNull: false },
      slotDateTime: { type: DataTypes.DATE, allowNull: false },
      requestedKwh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0.1 },
      },
      allocatedKwh: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      totalCost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled_in_time', 'cancelled_late'),
        defaultValue: 'pending',
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Bookings',
      indexes: [{
        unique: true,
        fields: ['consumerProfileId', 'slotDateTime']
      }]
    }
  );
};

export const associateBookingModel = (): void => {
  (Booking as any).belongsTo(ConsumerProfile, {
    foreignKey: 'consumerProfileId',
    as: 'consumer',
  });
  (Booking as any).belongsTo(ProducerOffering, {
    foreignKey: 'producerOfferingId',
    as: 'offering',
  });
};