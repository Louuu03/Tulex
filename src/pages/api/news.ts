import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodbClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    // First, check if the category exists

    // Now that we know the category exists, query for topics
    const news = await db.collection('news').findOne({
      status: 0,
    });
    return res.status(200).json({ message: 'Success', news });
  } catch (error: unknown) {
    // Explicitly marking error as unknown
    // Check if 'error' is an instance of 'Error'
    if (error instanceof Error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    } else {
      // Handle the case where the error is not an Error instance
      console.error('An unexpected error occurred:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
