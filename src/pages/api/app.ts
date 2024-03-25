import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodbClient';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';
import { Topic } from '@/utils/common-type';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const topicsCursor = await db.collection('topics').find({
      endtime: {
        $gt: new Date(),
      },
    });
    const topics: Topic[] = await topicsCursor.toArray();

    if (topics.length === 0) {
      return res.status(200).json({ message: 'No topics found' });
    } else {
      let newTopics = topics;
      newTopics.map(topic => {
        topic.endtime = DateTime.fromJSDate(topic.endtime).toISO();
      });
      let hotTopic = newTopics[0];
      for (const topic of topics) {
        if (
          topic.subscribed &&
          topic.subscribed.length > hotTopic.subscribed.length
        ) {
          hotTopic = topic;
        }
      }
      return res
        .status(200)
        .json({ message: 'Success', topics: newTopics, hotTopic });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
}
