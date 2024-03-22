import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../../lib/mongodbClient';
import Joi from 'joi';
import { DateTime } from 'luxon';

const basicUserSchema = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  short: Joi.string().required(),
  long: Joi.string().required(),
  create_time: Joi.date().required(),
  status: Joi.number().required(),
  language: Joi.array().items(Joi.string()).required(),
  topics: Joi.array()
    .items(
      Joi.object({
        topic_id: Joi.string().required(),
        name: Joi.string().required(),
        create_time: Joi.date().required(),
      })
    )
    .optional(),
  subscribed: Joi.array().items(Joi.string()).optional(),
}).min(1);

export default async (req, res) => {
  const { categoryId } = req.query;
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const categories = await db.collection('categories').find({}).toArray();
      if (!categories) {
        return res.status(404).json({ message: 'Category not found' });
      }
      //Change the date format to ISO
      let returnCategories = [];
      categories.forEach(category => {
        let returnCategory = { ...category };
        returnCategory.create_time = DateTime.fromJSDate(
          category.create_time
        ).toISO();
        returnCategories.push(returnCategory);
      });
      res.status(200).json(returnCategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    //Add
  } else if (req.method === 'POST') {
    try {
      const bodyValidation = basicUserSchema.validate(req.body);
      if (bodyValidation.error) {
        return res.status(400).json({
          message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
        });
      }
      const updateData = req.body;
      updateData.create_time = new Date(updateData.create_time); //Change the date format to ISO
      const updateResult = await db
        .collection('categories')
        .insertOne({ ...updateData });
      if (!updateResult.acknowledged) {
        return res.status(404).json({ message: 'Add Failed', updateResult });
      }
      res
        .status(200)
        .json({
          message: 'Category Add successfully',
          id: updateResult.insertedId,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    //Edit
  } else if (req.method === 'PUT') {
    const bodyValidation = basicUserSchema.validate(req.body);
    if (bodyValidation.error) {
      return res.status(400).json({
        message: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
      });
    }
    try {
      const { _id, ...updateData } = req.body; // Make sure to validate this data before using it.
      updateData.create_time = new Date(updateData.create_time); //Change the date format to ISO
      const updateResult = await db
        .collection('categories')
        .updateOne({ _id: new ObjectId(categoryId) }, { $set: updateData });
      if (!updateResult.modifiedCount) {
        return res
          .status(404)
          .json({ message: 'Category not found or no changes made' });
      }
      res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleteResult = await db
        .collection('categories')
        .deleteOne({ _id: new ObjectId(categoryId) });
      if (!deleteResult.deletedCount) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
