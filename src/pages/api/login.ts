import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import { getUsersCollection } from '@/lib/mongodb';
import { UserLoginReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { generateToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserLoginReturnType>) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString()); // Use _id in the token
    res.status(HttpStatus.Ok).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      message: 'Success',
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
