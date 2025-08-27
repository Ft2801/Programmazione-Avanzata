// runtime require for sequelize types to avoid editor type resolution issues
const SequelizePkg: any = require('sequelize');
const Model: any = SequelizePkg.Model;
const DataTypes: any = SequelizePkg.DataTypes;
import { User } from './user.model';
import { ProducerOffering } from './producerOffering.model';

export class ProducerProfile extends (Model as any) {
  public id!: number;
  public userId!: number;
  public energySource!: 'Fossile' | 'Eolico' | 'Fotovoltaico';
  public co2EmissionPerKwh!: number;
}

export const initProducerProfileModel = (sequelize: any): void => {
  (ProducerProfile as any).init(
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
  (ProducerProfile as any).belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
  
  // Associazione inversa: un produttore può avere molte offerte
  (ProducerProfile as any).hasMany(ProducerOffering, {
    foreignKey: 'producerProfileId',
    as: 'offerings',
  });
};