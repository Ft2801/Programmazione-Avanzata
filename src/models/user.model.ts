import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import { ProducerProfile } from './producerProfile.model';
import { ConsumerProfile } from './consumerProfile.model';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'producer' | 'consumer' | 'admin';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Metodo per confrontare la password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const initUserModel = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('producer', 'consumer', 'admin'),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Users',
      hooks: {
        // Hook per fare l'hash della password prima di creare o aggiornare l'utente
        beforeSave: async (user: User) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
};

// Funzione per definire le associazioni
export const associateUserModel = (): void => {
  User.hasOne(ProducerProfile, {
    foreignKey: 'userId',
    as: 'producerProfile',
  });
  User.hasOne(ConsumerProfile, {
    foreignKey: 'userId',
as: 'consumerProfile',
  });
};