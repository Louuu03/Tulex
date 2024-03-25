import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodbClient';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

const basicUserSchema = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.date().iso().required(),
  country: Joi.string().required(),
  gender: Joi.string().required(),
  img: Joi.string().uri().optional(),
  createAt:Joi.date().iso().required()
}).min(1); // Ensure at least one field is provided for update

const languageUserSchema = Joi.array()
  .items(Joi.number().valid(0, 1, 2))
  .required(); // Ensure at least one field is provided for update

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure method is PUT
  if (req.method !== 'PUT' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.cookies.userId;

  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: userId as unknown as ObjectId  });
    if (user&&user.birthday) {
      const cookieOptions = {
        secure: 'development',
      };

      res.setHeader('Set-Cookie', [
        `isNewUser=${false}; Path=/; HttpOnly; SameSite=Strict; ${cookieOptions.secure ? 'Secure' : ''}`,
      ]);
      return res.status(203).json({ message: 'User already exists' });
    }
    return res.status(200).json({ message: 'Success' });
  }


  //update to db

  if (userId &&req.method === 'PUT') {
    const { db } = await connectToDatabase();

    const bodyValidation =
    req.query.method === 'basic'
      ? basicUserSchema.validate(req.body)
      : languageUserSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    });
  }

    const updates = bodyValidation.value;
    let userData = updates;
    userData.birthday=new Date(userData.birthday);
    userData.createAt=new Date(userData.createAt);

    try {
      let result;
      if (req.query.method === 'basic') {
        result = await db
          .collection('users')
          .updateOne({ _id: userId  as unknown as ObjectId }, { $set: updates });
      } else {
        result = await db
          .collection('users')
          .updateOne(
            { _id: userId as unknown as ObjectId },
            { $set: { learning: { writing: updates, speaking: updates } } }
          );
      }

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found', userId });
      }

      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  } else {
    return res.status(401).json({ message: 'User not found' });
  }
}
