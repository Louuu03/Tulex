import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../../lib/mongodbClient';
import Joi from 'joi';
import { DateTime } from 'luxon';

const basicUserSchema = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  create_time: Joi.date().required(),
  description: Joi.string().required(),
  endtime: Joi.date().required(),
  steps: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        details: Joi.string().required(),
      })
    )
    .required(),
  category_id: Joi.string().required(),
  category_name: Joi.string().required(),
  example: Joi.array().items(Joi.string()).required(),
  language: Joi.number().required(),
  level: Joi.number().required(),
  subscribed: Joi.array().items(Joi.string()).optional(), // Array of strings that should be valid MongoDB ObjectIds
}).min(1); // Ensure at least one field is provided for update

export default async (req, res) => {
  const { topicId } = req.query;
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const topics = await db.collection('topics').find({}).toArray();
      if (!topics) {
        return res.status(404).json({ message: 'Topics not found' });
      }
      // Change the date format to ISO
      let returnTopics = [];
      topics.forEach(topic => {
        let returnTopic = { ...topic };
        returnTopic.create_time = DateTime.fromJSDate(
          topic.create_time
        ).toISO();
        returnTopic.endtime = DateTime.fromJSDate(topic.endtime).toISO();
        returnTopics.push(returnTopic);
      });
      res.status(200).json(returnTopics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    const bodyValidation = basicUserSchema.validate(req.body);
    if (bodyValidation.error) {
      return res.status(400).json({
        error: bodyValidation.error,
        message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
      });
    }
    try {
      const updateData = req.body;
      updateData.create_time = new Date(updateData.create_time); //Change the date format to ISO
      updateData.endtime = new Date(updateData.endtime);
      updateData.category_id = new ObjectId(updateData.category_id);
      const updateResult = await db
        .collection('topics')
        .insertOne({ ...updateData });
      if (!updateResult.acknowledged) {
        return res.status(404).json({
          message: 'Topics not found or no changes made',
          updateResult,
        });
      } else {
        const addToCategory = await db.collection('categories').updateOne(
          { _id: new ObjectId(updateData.category_id) },
          {
            $addToSet: {
              topics: {
                topic_id: new ObjectId(updateResult.insertedId),
                name: updateData.name,
                create_time: updateData.create_time,
              },
            },
          }
        );
        addToCategory &&
          res
            .status(200)
            .json({
              message: 'Topics Add successfully',
              id: updateResult.insertedId,
            });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const bodyValidation = basicUserSchema.validate(req.body);
      if (bodyValidation.error) {
        return res.status(400).json({
          error: bodyValidation.error,
          message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
        });
      }
      const { _id, ...updateData } = req.body;
      updateData.create_time = new Date(updateData.create_time); //Change the date format to ISO
      updateData.endtime = new Date(updateData.endtime);
      updateData.category_id = new ObjectId(updateData.category_id);
      const updateResult = await db
        .collection('topics')
        .updateOne({ _id: new ObjectId(topicId) }, { $set: updateData });
      if (!updateResult.modifiedCount) {
        return res
          .status(404)
          .json({ message: 'Topic not found or no changes made' });
      }
      await db
        .collection('categories')
        .updateOne(
          { _id: new ObjectId(updateData.category_id) },
          {
            $set: {
              'topics.$[elem].name': updateData.name,
              'topics.$[elem].create_time': updateData.create_time,
            },
          },
          { arrayFilters: [{ 'elem.topic_id': new ObjectId(_id) }] }
        );
      res.status(200).json({ message: 'Topic updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleteResult = await db
        .collection('topics')
        .deleteOne({ _id: new ObjectId(topicId) });
      if (!deleteResult.deletedCount) {
        return res.status(404).json({ message: 'Topic not found' });
      } else {
        console.log(req.body);
        await db
          .collection('categories')
          .updateOne(
            { _id: new ObjectId(req.body.category_id) },
            { $pull: { subscribed: new ObjectId(topicId) } }
          );
        res.status(200).json({ message: 'Topic deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
