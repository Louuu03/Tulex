import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

const basicUserSchema = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.date().iso().required(),
  country: Joi.string().required(),
  gender: Joi.string().required(),
  img: Joi.string().allow('').optional(),
}).min(1); // Ensure at least one field is provided for update

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
    try {
      const { db } = await connectToDatabase();
      const user = await db
        .collection('users')
        .findOne({ _id: userId as unknown as ObjectId });

      return res.status(203).json({ message: 'Sucess', user });
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  //validate the body
  const bodyValidation = basicUserSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    });
  }

  //update to db

  if (userId) {
    const { db } = await connectToDatabase();

    const updates = bodyValidation.value;
    let userData = updates;
    userData.birthday = new Date(userData.birthday);
    try {
      let result = await db
        .collection('users')
        .updateOne({ _id: userId as unknown as ObjectId }, { $set: userData });

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
