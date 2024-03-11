const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define Joi schema for validating the optional update fields
const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  short: Joi.string().optional(),
  long: Joi.string().optional(),
  topics: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        topic_id: Joi.string()
          .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
          .required(), // Validates if string is a valid MongoDB ObjectId
        create_time: Joi.date().required(),
      })
    )
    .optional(),
  status: Joi.number().optional(),
  language: Joi.array().items(Joi.number()).optional(),
  subscribed: Joi.array()
    .items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')))
    .optional(), // Array of strings that should be valid MongoDB ObjectIds
}).min(1); // Ensure at least one field is provided for update

// Validate pathParameters for a valid ObjectId
const idSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
});

module.exports = async event => {
  // Validate the incoming pathParameters
  const pathValidation = idSchema.validate(event.pathParameters);
  if (pathValidation.error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${pathValidation.error.details.map(x => x.message).join(', ')}`,
    };
  }

  // Validate the incoming update body
  const bodyValidation = updateCategorySchema.validate(JSON.parse(event.body));
  if (bodyValidation.error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    };
  }

  const { db } = await connectToDatabase();
  const categoryId = new ObjectId(pathValidation.value.id);
  const updates = bodyValidation.value;

  try {
    const result = await db
      .collection('categories')
      .updateOne({ _id: categoryId }, { $set: updates });

    if (result.matchedCount === 0) {
      return { statusCode: 404, body: 'Category not found' };
    }

    return {
      statusCode: 200,
      body: 'Category updated successfully',
    };
  } catch (error) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
