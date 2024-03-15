const Joi = require('joi');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

const articleValidationSchema = Joi.object({
  user_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
  category_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
  topic_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
  content: Joi.string().required(),
  last_save: Joi.date().required(),
  status: Joi.number().required(),
  create_time: Joi.date().required(),
  feedback: Joi.object({
    rating: Joi.number(),
    comment: Joi.string(),
    suggestion: Joi.string(),
    article: Joi.string(),
    highlights: Joi.array().items(
      Joi.object({
        word: Joi.string().required(),
        explanation: Joi.string().required(),
      })
    ),
  }),
  language: Joi.number().required(),
});

module.exports = async event => {
  // Validate the incoming event body with Joi
  const { error, value } = articleValidationSchema.validate(
    JSON.parse(event.body)
  );

  // If validation fails, return an error response
  if (error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${error.details.map(x => x.message).join(', ')}`,
    };
  }

  // If validation is successful, proceed with database operation
  try {
    const { db } = await connectToDatabase();
    db.collection('articles').insertOne(value); // Use validated value
    return {
      statusCode: 201,
      body: 'Document inserted successfully',
    };
  } catch (dbError) {
    console.error('Database Error:', dbError.message);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
