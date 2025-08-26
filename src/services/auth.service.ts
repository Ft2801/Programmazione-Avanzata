import jwt from 'jsonwebtoken';
import { User, ProducerProfile, ConsumerProfile } from '../models';
import sequelize from '../config/database';
import { AppError } from '../utils/AppError';

const generateToken = (id: number, role: string): string => {
  const secret = process.env.JWT_SECRET as string | undefined;
  const expiresIn = process.env.JWT_EXPIRES_IN as string | undefined;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.sign({ id, role } as object, secret, { expiresIn: expiresIn as any });
};

export const register = async (userData: any) => {
  const { email, password, role, profileData } = userData;

  // 1. Controlla se l'utente esiste già
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409); // Conflict
  }

  // 2. Usa una transazione per garantire l'atomicità
  const t = await sequelize.transaction();
  try {
    // 3. Crea l'utente
    const user = await User.create({ email, password, role }, { transaction: t });

    // 4. Crea il profilo associato
    if (role === 'producer') {
      await ProducerProfile.create({ userId: user.id, ...profileData }, { transaction: t });
    } else if (role === 'consumer') {
      await ConsumerProfile.create(
        { userId: user.id, creditBalance: profileData.initialCredit },
        { transaction: t }
      );
    }

    // 5. Se tutto va bene, committa la transazione
    await t.commit();
    
    // 6. Genera il token
    const token = generateToken(user.id, user.role);
    
    // Rimuovi la password dalla risposta
    const userJson = user.toJSON();
    delete userJson.password;
    
    return { user: userJson, token };

  } catch (error) {
    // 7. Se qualcosa va storto, fai il rollback
    await t.rollback();
    throw new AppError('Registration failed. Please try again.', 500);
  }
};

export const login = async (credentials: any) => {
  const { email, password } = credentials;

  // 1. Trova l'utente
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password.', 401); // Unauthorized
  }

  // 2. Genera il token
  const token = generateToken(user.id, user.role);
  
  const userJson = user.toJSON();
  delete userJson.password;

  return { user: userJson, token };
};