import bcrypt from 'bcrypt';
import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

import { UserWithPasswordProps } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { loginValidationSchema } from '@/lib/validation';
import { ManageProps, UserLoginReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import getManageRecordsByUserId from '@/utils/apiFunctions';
import { generateToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserLoginReturnType>) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    await loginValidationSchema.validate(req.body, { abortEarly: false });

    const usersCollection: Collection<Omit<UserWithPasswordProps, '_id'>> = await getUsersCollection();

    const user = await usersCollection.findOne({ email, $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] });

    if (!user) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid email or password' });
    }

    const manage: ManageProps = await getManageRecordsByUserId(user._id);

    const token = await generateToken({ user, manage });

    res.status(HttpStatus.Ok).json({
      token,
      message: 'Success',
    });
  } catch (error) {
    if (error instanceof ValidationError)
      return res.status(HttpStatus.BadRequest).json({ message: error.errors.join(', ') });
    console.error('Error logging in:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
