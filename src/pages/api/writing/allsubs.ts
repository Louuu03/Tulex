import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import { DateTime } from 'luxon';
import { cloneDeep } from 'lodash';
import { Article } from '@/utils/common-type';

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
    const articleCursor = db.collection('articles').find({
      status: 1,
      user_id: userId,
    });
    const articles: Article[] =
      (await articleCursor.toArray()) as unknown as Article[];

    if (articles.length === 0) {
      return res.status(200).json({ message: 'No topics found', articles: [] });
    }
    let newData = cloneDeep(articles);
    newData.map(article => {
      article.endtime = DateTime.fromJSDate(article.endtime).toISO();
    });
    return res
      .status(200)
      .json({ message: 'Success', articles: newData, userId });
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
