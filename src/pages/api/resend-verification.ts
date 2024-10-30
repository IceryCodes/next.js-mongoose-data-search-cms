import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { getUsersCollection } from '@/lib/mongodb';
import { UserResendVerificationReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import sendEmail from '@/utils/sendEmail';
import { generateToken, isExpiredToken } from '@/utils/token';
import verificationEmailTemplate from '@/utils/verificationEmailTemplate';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserResendVerificationReturnType>) => {
  // renew token
  if (req.method !== 'POST') return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  }

  const { _id } = req.body;

  if (!_id || typeof _id !== 'string') return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });

  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(_id),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!user) return res.status(HttpStatus.NotFound).json({ message: '驗證失效!' });

    if (user.isVerified) return res.status(HttpStatus.BadRequest).json({ message: '已通過驗證!' });

    const verificationToken: string = await generateToken({ _id, role: user.role });
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: `[${process.env.NEXT_PUBLIC_SITE_NAME}] 歡迎${user.lastName} ${user.firstName}進行信箱驗證!`,
      html: verificationEmailTemplate({ userName: `${user.lastName} ${user.firstName}`, verificationLink }),
    });

    res.status(HttpStatus.Ok).json({ message: '已重新寄送驗證信件!' });
  } catch (error) {
    console.error('Error sending verification link:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
