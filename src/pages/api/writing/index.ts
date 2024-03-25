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
    const topicsCursor = await db.collection('topics').find({
      create_time: { $lt: new Date() },
      endtime: {
        $gt: new Date(),
      },
    });
    const topics: Topic[] = await topicsCursor.toArray();
    const articles = await db
      .collection('articles')
      .find({ user_id: userId, status: 0 })
      .toArray();
    let newTopics = topics;
    newTopics.map(topic => {
      topic.endtime = DateTime.fromJSDate(topic.endtime).toISO();
    });

    if (articles.length === 0) {
      return res.status(200).json({
        message: 'No articles found',
        topics: newTopics,
        articles: [],
      });
    } else {
      let newArticles = articles;
      newArticles.map(article => {
        article.endtime = DateTime.fromJSDate(article.endtime).toISO();
      });
      return res
        .status(200)
        .json({ message: 'Success', topics: newTopics, articles: newArticles });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
}
