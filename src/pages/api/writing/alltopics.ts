import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';
import { Category, Topic } from '@/utils/common-type';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let categoryId;
  const userId = req.cookies.userId;
  try {
    // Attempt to convert the query parameter to an ObjectId
    categoryId = new ObjectId(req.query.category_id as string);
  } catch (error) {
    // If conversion fails, return an error response
    return res.status(400).json({ message: 'Invalid category_id provided' });
  }

  try {
    const { db } = await connectToDatabase();

    // First, check if the category exists
    const category: Category = (await db
      .collection('categories')
      .findOne({ _id: new ObjectId(categoryId) })) as unknown as Category;
    if (!category) {
      // If the category doesn't exist, there's no need to query for topics
      return res.status(404).json({ message: 'Category not found' });
    }

    // Now that we know the category exists, query for topics
    const topicsCursor = db.collection('topics').find({
      create_time: { $lt: new Date() }, // create_time is earlier than now
      category_id: new ObjectId(categoryId),
    });
    const topics: Topic[] =
      (await topicsCursor.toArray()) as unknown as Topic[];

    if (topics.length === 0) {
      return res
        .status(200)
        .json({ message: 'No topics found', topics: [], category });
    }
    let newTopics:Topic[] = [];
    topics.forEach(topic => {
      topic.create_time = DateTime.fromJSDate(topic.create_time).toISO();
      topic.endtime = DateTime.fromJSDate(topic.endtime).toISO();
      newTopics.push(topic);
    });

    return res
      .status(200)
      .json({ message: 'Success', topics: newTopics, category, userId });
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
