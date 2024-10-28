import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { getUsersCollection } from '@/lib/mongodb';
import { GetUserReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken, TokenProps, verifyToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetUserReturnType>) => {
  // renew token
  if (req.method !== 'GET') return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('Unauthorized');
    return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  }

  try {
    const { _id }: TokenProps = await verifyToken(token);
    const usersCollection = await getUsersCollection();

    // Find the user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(_id) });

    if (!user) {
      console.error('User not found');
      return res.status(HttpStatus.NotFound).json({ message: 'User not found' });
    }

    // Return user details (exclude password)
    res.status(HttpStatus.Ok).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: 'Success',
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
