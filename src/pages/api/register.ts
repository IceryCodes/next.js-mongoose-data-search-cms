import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

import { UserRoleType } from '@/domains/interfaces';
import { UserProps, UserWithPasswordProps } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { registerValidationSchema } from '@/lib/validation';
import { UserLoginReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { generateToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserLoginReturnType>) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, gender, email, password } = req.body;

  try {
    await registerValidationSchema.validate(req.body, { abortEarly: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const usersCollection = await getUsersCollection();

    const newUser: Omit<UserWithPasswordProps, '_id'> = {
      firstName,
      lastName,
      gender,
      email,
      password: hashedPassword,
      role: UserRoleType.None,
    };

    const result = await usersCollection.insertOne(newUser);
    const userId: ObjectId = result.insertedId; // Get the generated ObjectId

    const user: UserProps = {
      _id: userId,
      firstName,
      lastName,
      gender,
      email,
      role: UserRoleType.None,
    };

    const token = generateToken(userId.toString()); // Use _id in the token
    res.status(HttpStatus.Created).json({ token, user, message: 'Success' });
  } catch (error) {
    if (error instanceof ValidationError)
      return res.status(HttpStatus.BadRequest).json({ message: error.errors.join(', ') });

    console.error('Error register user details:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
