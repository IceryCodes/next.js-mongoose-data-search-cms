import jwt, { JwtPayload } from 'jsonwebtoken';

// Update this function to generate a token with _id
export const generateToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.NEXT_PRIVATE_JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    // Verify the token and cast the result to JwtPayload
    const decoded = jwt.verify(token, process.env.NEXT_PRIVATE_JWT_SECRET) as JwtPayload;

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
