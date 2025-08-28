"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.ProducerOffering = exports.ConsumerProfile = exports.ProducerProfile = exports.User = exports.initModels = void 0;
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const producerProfile_model_1 = require("./producerProfile.model");
Object.defineProperty(exports, "ProducerProfile", { enumerable: true, get: function () { return producerProfile_model_1.ProducerProfile; } });
const consumerProfile_model_1 = require("./consumerProfile.model");
Object.defineProperty(exports, "ConsumerProfile", { enumerable: true, get: function () { return consumerProfile_model_1.ConsumerProfile; } });
const producerOffering_model_1 = require("./producerOffering.model");
const booking_model_1 = require("./booking.model");
const initModels = (sequelize) => {
    // Inizializza tutti i modelli
    (0, user_model_1.initUserModel)(sequelize);
    (0, producerProfile_model_1.initProducerProfileModel)(sequelize);
    (0, producerOffering_model_1.initProducerOfferingModel)(sequelize);
    (0, consumerProfile_model_1.initConsumerProfileModel)(sequelize);
    // Inizializza il modello Booking dopo che i modelli referenziati sono stati inizializzati
    (0, booking_model_1.initBookingModel)(sequelize);
    // Crea le associazioni tra i modelli
    (0, user_model_1.associateUserModel)();
    (0, producerProfile_model_1.associateProducerProfileModel)();
    (0, producerOffering_model_1.associateProducerOfferingModel)();
    (0, consumerProfile_model_1.associateConsumerProfileModel)();
    // Associazioni del modello Booking (usa ConsumerProfile e ProducerOffering)
    (0, booking_model_1.associateBookingModel)();
};
exports.initModels = initModels;
var producerOffering_model_2 = require("./producerOffering.model");
Object.defineProperty(exports, "ProducerOffering", { enumerable: true, get: function () { return producerOffering_model_2.ProducerOffering; } });
var booking_model_2 = require("./booking.model");
Object.defineProperty(exports, "Booking", { enumerable: true, get: function () { return booking_model_2.Booking; } });
//# sourceMappingURL=index.js.map