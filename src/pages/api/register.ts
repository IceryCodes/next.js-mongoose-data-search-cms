import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { UserProps, UserRegisterDto } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { UserLoginReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { generateToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserLoginReturnType>) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const usersCollection = await getUsersCollection();

    const newUser: UserRegisterDto = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const result = await usersCollection.insertOne(newUser);
    const userId: ObjectId = result.insertedId; // Get the generated ObjectId

    const user: UserProps = {
      _id: userId,
      firstName,
      lastName,
      email,
    };

    const token = generateToken(userId.toString()); // Use _id in the token
    res.status(HttpStatus.Created).json({ token, user, message: 'Success' });
  } catch (error) {
    console.error('Error register user details:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
