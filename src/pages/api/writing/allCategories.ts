import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import { ObjectId } from 'mongodb';
import { Category } from '@/utils/common-type';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const categoryId = new ObjectId(req.body.category_id); // Convert to ObjectId
      const isSubscribed = req.body.isSubscribed; // Assuming this is a boolean
      const userId = req.cookies.userId as string; // Convert to ObjectId

      const { db } = await connectToDatabase();

      // Update the category subscription status
      const updateCategory = isSubscribed
        ? await db.collection('categories').updateOne(
            { _id: categoryId },
            { $pull: { subscribed: userId.toString() } } // Remove user from subscribed array
          )
        : await db.collection('categories').updateOne(
            { _id: categoryId },
            { $addToSet: { subscribed: userId.toString() } } // Add user to subscribed array
          );

      // Update the user's categories array
      const updateUser = isSubscribed
        ? await db.collection('users').updateOne(
            { _id: userId as unknown as ObjectId },
            { $pull: { categories: new ObjectId(categoryId) } } // Remove category from user's categories array
          )
        : await db.collection('users').updateOne(
            { _id: userId as unknown as ObjectId },
            { $addToSet: { categories: new ObjectId(categoryId) } } // Add category to user's categories array
          );

      return res.status(200).json({ message: 'Update successful' });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const userId = req.cookies.userId;
      const { db } = await connectToDatabase();
      const CategoryCursor = await db.collection('categories').find({});
      const category: Category[] =
        (await CategoryCursor.toArray()) as Category[];
      if (category.length === 0) {
        return res.status(200).json({ message: 'No category found' });
      } else {
        return res.status(200).json({ message: 'Success', category, userId });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
