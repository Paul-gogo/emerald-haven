import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },  // <-- include email here
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return token;
};
