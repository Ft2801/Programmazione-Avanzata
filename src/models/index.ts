import { initUserModel, associateUserModel, User } from './user.model';
import { initProducerProfileModel, associateProducerProfileModel, ProducerProfile } from './producerProfile.model';
import { initConsumerProfileModel, associateConsumerProfileModel, ConsumerProfile } from './consumerProfile.model';
import { initProducerOfferingModel, associateProducerOfferingModel } from './producerOffering.model';
import { initBookingModel, associateBookingModel, Booking } from './booking.model';

export const initModels = (sequelize: any): void => {
  // Inizializza tutti i modelli
  initUserModel(sequelize);
  initProducerProfileModel(sequelize);
  initProducerOfferingModel(sequelize);
  initConsumerProfileModel(sequelize);
  // Inizializza il modello Booking dopo che i modelli referenziati sono stati inizializzati
  initBookingModel(sequelize);

  // Crea le associazioni tra i modelli
  associateUserModel();
  associateProducerProfileModel();
  associateProducerOfferingModel();
  associateConsumerProfileModel();
  // Associazioni del modello Booking (usa ConsumerProfile e ProducerOffering)
  associateBookingModel();
};

// Esporta i modelli per un facile accesso
export { User, ProducerProfile, ConsumerProfile };
export { ProducerOffering } from './producerOffering.model';
export { Booking } from './booking.model';