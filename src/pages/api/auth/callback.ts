//set tokens in cookies and check if user existed.
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import Joi from 'joi';


const callbackSchema = Joi.object({
  idToken: Joi.string().required(),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
  userId: Joi.string().required()
  }).required();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  // Parse the tokens sent from the frontend
  let isNewUser = false;
  const bodyValidation = callbackSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    });
  }
  const { idToken, accessToken, refreshToken, userId } = bodyValidation.value;
  // Check if the user existed

  const { db } = await connectToDatabase();

  // Check if the user exists
  const user = await db.collection('users').findOne({ _id: userId });

  if (!user) {
    // New user, add them with file metadata
    isNewUser = true;
    const UserData = {
      _id: userId,
      plan: 0,
      language: 0,
      createdAt: new Date(),
    };
    await db.collection('users').insertOne(UserData);
  } else {
    // User exists, but no basic info
    !user.birthday && (isNewUser = true);
  }

  // Cookie settings for development
  const cookieOptions = {
    secure: 'development',
  };

  // Set a reasonable expiry for each token
  const idTokenExpiry = new Date(Date.now() + 300 * 1000); //  5 minutes
  const accessTokenExpiry = new Date(Date.now() + 300 * 1000); //   5 minutes
  const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days
  const userIdExpiry = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days

  // Set cookies
  res.setHeader('Set-Cookie', [
    `isNewUser=${isNewUser}; Path=/; HttpOnly; SameSite=Strict; ${cookieOptions.secure ? 'Secure' : ''}`,
    `userId=${userId}; Expires=${userIdExpiry.toUTCString()}; Path=/; HttpOnly; SameSite=Strict; ${cookieOptions.secure ? 'Secure' : ''}`,
    `idToken=${idToken}; Expires=${idTokenExpiry.toUTCString()}; Path=/; HttpOnly; SameSite=Strict; ${cookieOptions.secure ? 'Secure' : ''}`,
    `accessToken=${accessToken}; Expires=${accessTokenExpiry.toUTCString()}; Path=/; HttpOnly; SameSite=Strict; ${cookieOptions.secure ? 'Secure' : ''}`,
    `refreshToken=${refreshToken}; Expires=${refreshTokenExpiry.toUTCString()}; Path=/; HttpOnly; SameSite=Strict; ${cookieOptions.secure ? 'Secure' : ''}`,
  ]);

  // Return a response to the client
  isNewUser
    ? res
        .status(201)
        .json({ message: 'User created and token stored in cookies' })
    : res.status(200).json({ message: 'Tokens stored in cookies' });
}
