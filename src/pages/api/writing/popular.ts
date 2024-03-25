import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import { DateTime } from 'luxon';
import { Topic } from '@/utils/common-type';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.cookies.userId;

  try {
    const { db } = await connectToDatabase();

    // First, check if the category exists

    // Now that we know the category exists, query for topics
    const topicCursor = db.collection('topics').aggregate([
      {
        $match: {
          endtime: { $gt: new Date() },
        },
      },
      {
        $addFields: {
          subscribedArray: {
            $cond: {
              if: { $eq: [{ $type: "$subscribed" }, "array"] },
              then: "$subscribed",
              else: [] // Default to an empty array if not an array
            }
          }
        },
      },
      {
        $sort: {
          subscribedSize: -1,
        },
      },
    ]);
    const topics: Topic[] =
      (await topicCursor.toArray()) as unknown as Topic[];

    if (topics.length === 0) {
      return res
        .status(200)
        .json({ message: 'No topics found', topics: [], userId });
    }
    let newTopics = topics;
    newTopics.map(topic => {
      topic.endtime = DateTime.fromJSDate(topic.endtime).toISO();
    });
    return res
      .status(200)
      .json({ message: 'Success', topics: newTopics, userId });
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
