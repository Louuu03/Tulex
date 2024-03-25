import type { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';
import { connectToDatabase } from '../../../../lib/mongodbClient';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

const updateSubscriptionSchema = Joi.object({
  status: Joi.number().required(),
  topic: Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    create_time: Joi.string().optional(),
    description: Joi.string().optional(),
    endtime: Joi.string().required(),
    steps: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          details: Joi.string().required(),
        })
      )
      .optional(),
    category_id: Joi.string().required(),
    example: Joi.array().items(Joi.string()).optional(),
    level: Joi.number().required(),
    subscribed: Joi.array().items(Joi.string()).optional(),
    language: Joi.number().required(),
    category_name: Joi.string().optional(),
  }).required(),
}).min(1);

const saveArticleSchema = Joi.object({
  content: Joi.string().allow('').required(),
  time: Joi.date().required(),
});

const submitSchema = Joi.object({
  content: Joi.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure method is POST
  if (req.method == 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = req.cookies.userId;
  const { db } = await connectToDatabase();
  //GET atopics
  if (req.method == 'GET') {
    const topicId = req.query.id as string;
    try {
      //Get the topic
      const topic = await db
        .collection('topics')
        .findOne({ _id: new ObjectId(topicId) });

      if (!topic) {
        return res.status(401).json({ message: 'Topic not found' });
      }
      //If is subscribed, get the article
      const isSubscribed =
        topic.subscribed &&
        topic.subscribed.length > 0 &&
        topic.subscribed.includes(userId);
      const article = await db
        .collection('articles')
        .findOne({ user_id: userId, topic_id: new ObjectId(topicId) });

      let newTopic = topic;
      newTopic.endtime = DateTime.fromJSDate(topic.endtime).toISO();
      newTopic.create_time = DateTime.fromJSDate(topic.create_time).toISO();

      // If the user is subscribed, return the article or add a new article
      if (isSubscribed) {
        if (article) {
          let newArticle = article;
          newArticle.last_save = DateTime.fromJSDate(
            newArticle.last_save
          ).toISO();
          newArticle.endtime = DateTime.fromJSDate(newArticle.endtime).toISO();
          newArticle.create_time = DateTime.fromJSDate(
            newArticle.create_time
          ).toISO();
          return res.status(202).json({
            message: 'Success',
            topic: newTopic,
            article: newArticle,
            userId,
          });
        } else {
          const newData = {
            user_id: userId,
            topic_id: new ObjectId(topicId),
            status: 0,
            content: '',
            last_save: new Date(),
            create_time: new Date(),
            language: topic.language,
            category_id: new ObjectId(topic.category_id),
            category_name: topic.category_name,
            name: topic.name,
            endtime: topic.endtime,
            level: topic.level,
          };
          await db.collection('articles').insertOne(newData);
          newData.last_save = DateTime.fromJSDate(newData.last_save).toISO();
          newData.create_time = DateTime.fromJSDate(
            newData.create_time
          ).toISO();
          newData.endtime = DateTime.fromJSDate(newData.endtime).toISO();
          return res.status(202).json({
            message: 'Success',
            topic: newTopic,
            article: newData,
            userId,
          });
        }
      } else {
        // If the user is not subscribed, delete the article and return the topic
        if (article) {
          await db
            .collection('articles')
            .deleteOne({ user_id: userId, topic_id: new ObjectId(topicId) });
          // Optionally notify the user that their article was deleted
          return res.status(201).json({
            message: 'Article deleted because user is not subscribed',
            topic: newTopic,
            userId,
          });
        } else {
          return res.status(200).json({
            message: 'Successfully retrieved topic',
            topic: newTopic,
            userId,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  //Update subscripton
  if (req.method == 'PUT') {
    const method = req.query.method;
    if (method === 'subscribe') {
      const topicId = req.query.id as string;
      // Validate body, assuming you have validation in place
      const { topic } = req.body;
      try {
        const bodyValidation = updateSubscriptionSchema.validate(req.body);
        if (bodyValidation.error) {
          return res.status(400).json({
            message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
          });
        }
        const { status } = bodyValidation.value;

        // Use updateOne method with $addToSet and $pull to modify the subscribed array
        if (status === 0) {
          // Subscribe user
          const result = await db
            .collection('topics')
            .updateOne(
              { _id: new ObjectId(topicId) },
              { $addToSet: { subscribed: userId } }
            );
          // Check the result and respond accordingly
          if (result.modifiedCount === 1) {
            //add new article
            const newData = {
              user_id: userId,
              topic_id: new ObjectId(topicId),
              status: 0,
              content: '',
              last_save: new Date(),
              create_time: new Date(),
              language: topic.language,
              category_id: new ObjectId(topic.category_id),
              category_name: topic.category_name,
              name: topic.name,
              endtime: new Date(topic.endtime),
              level: topic.level,
            };
            await db.collection('articles').insertOne(newData);
            newData.last_save = DateTime.fromJSDate(newData.last_save).toISO();
            newData.create_time = DateTime.fromJSDate(
              newData.create_time
            ).toISO();
            newData.endtime = DateTime.fromJSDate(newData.endtime).toISO();
            return res.status(202).json({
              message: 'Subscribed successfully.',
              article: newData,
              userId
            });
          } else {
            return res.status(200).json({
              message: 'You are already subscribed or the topic was not found.',
            });
          }
        // Unsubscribe user
        } else if (status === 1) {
          const unsubscribeResult = await db.collection('topics').updateOne(
            { _id: new ObjectId(topicId) },
            { $pull: { subscribed: userId } } // $pull removes the value from the array
          );
          await db
            .collection('articles')
            .deleteOne({ user_id: userId, topic_id: new ObjectId(topicId) });
          return res.status(203).json({
            message: 'Unsubscribed successfully',
            result: unsubscribeResult,
            userId
          });
        }
      } catch (error) {
        return res.status(500).json({
          message: 'An unexpected error occurred',
          error: error.message,
        });
      }
    } else if (method === 'save') {
      const articleId = req.query.id as string;
      try {
        const bodyValidation = saveArticleSchema.validate(req.body);
        if (bodyValidation.error) {
          return res.status(400).json({
            message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
          });
        }
        const { content, time } = bodyValidation.value;
        const collection = db.collection('articles');
        await collection.updateOne(
          { _id: new ObjectId(articleId) },
          {
            $set: {
              content: content,
              last_save: new Date(time), // This will set the current date and time
            },
          }
        );
        return (
          collection &&
          res.status(200).json({
            message: 'Article saved successfully',
          })
        );
      } catch (error) {
        return res.status(500).json({
          message: 'An unexpected error occurred',
          error: error.message,
        });
      }
    } else if (method === 'submit') {
      const articleId = req.query.id as string;
      try {
        const bodyValidation = submitSchema.validate(req.body);
        if (bodyValidation.error) {
          return res.status(400).json({
            message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
          });
        }
        const { content } = bodyValidation.value;
        const collection = db.collection('articles');
        await collection.updateOne(
          { _id: new ObjectId(articleId) },
          {
            $set: {
              content: content,
              status: 1,
              last_save: new Date(), // This will set the current date and time
            },
          }
        );
        return (
          collection &&
          res.status(200).json({
            message: 'Article submitted successfully',
          })
        );
      } catch (error) {
        return res.status(500).json({
          message: 'An unexpected error occurred',
          error: error.message,
        });
      }
    }

    return res.status(401).json({ message: 'User not found' });
  }
}
