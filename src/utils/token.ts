import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PRIVATE_JWT_SECRET;

export const generateToken = (userId: string): string => jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '1h' });

export const verifyToken = (token: string): string => {
  try {
    // Verify the token and cast the result to JwtPayload
    const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check if _id exists in decoded token
    if (typeof decoded._id !== 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded._id; // Return user ID
  } catch (error) {
    console.error('Invalid token', error);
    throw new Error('Invalid token');
  }
};
