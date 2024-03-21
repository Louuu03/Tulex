import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import Joi from 'joi';

const basicUserSchema = Joi.object({
  suggestion: Joi.string().required(),
}).min(1); // Ensure at least one field is provided for update

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.cookies.userId;

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

    const { suggestion } = bodyValidation.value;

    try {
      let result = await db
        .collection('suggestions')
        .insertOne({ suggestion, userId, createdAt: new Date() });

      return res.status(200).json({ message: 'Sent successfully' });
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
