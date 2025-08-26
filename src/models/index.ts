import { Sequelize } from 'sequelize';
import { initUserModel, associateUserModel, User } from './user.model';
import { initProducerProfileModel, associateProducerProfileModel, ProducerProfile } from './producerProfile.model';
import { initConsumerProfileModel, associateConsumerProfileModel, ConsumerProfile } from './consumerProfile.model';

export const initModels = (sequelize: Sequelize): void => {
  // Inizializza tutti i modelli
  initUserModel(sequelize);
  initProducerProfileModel(sequelize);
  initConsumerProfileModel(sequelize);

  // Crea le associazioni tra i modelli
  associateUserModel();
  associateProducerProfileModel();
  associateConsumerProfileModel();
};

// Esporta i modelli per un facile accesso
export { User, ProducerProfile, ConsumerProfile };