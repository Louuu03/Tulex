const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define Joi schema for validating the optional update fields for a topic
const updateTopicSchema = Joi.object({
  name: Joi.string().optional(),
  create_time: Joi.date().optional(),
  description: Joi.string().optional(),
  endtime: Joi.date().optional(),
  steps: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        details: Joi.string().required(),
      })
    )
    .optional(),
  category_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  example: Joi.array().items(Joi.string()).optional(),
  language: Joi.number().optional(),
  level: Joi.number().optional(),
  subscribed: Joi.array()
    .items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')))
    .optional(),
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
  const bodyValidation = updateTopicSchema.validate(JSON.parse(event.body));
  if (bodyValidation.error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    };
  }

  const { db } = await connectToDatabase();
  const topicId = new ObjectId(pathValidation.value.id);
  const updates = bodyValidation.value;

  try {
    const result = await db
      .collection('topics')
      .updateOne({ _id: topicId }, { $set: updates });

    if (result.matchedCount === 0) {
      return { statusCode: 404, body: 'Topic not found' };
    }

    return {
      statusCode: 200,
      body: 'Topic updated successfully',
    };
  } catch (error) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
