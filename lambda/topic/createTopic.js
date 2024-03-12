const Joi = require('joi');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define Joi validation schema corresponding to the MongoDB topic schema
const topicValidationSchema = Joi.object({
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
  category_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
  example: Joi.array().items(Joi.string()).required(),
  language: Joi.number().required(),
  level: Joi.number().required(),
  subscribed: Joi.array()
    .items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')))
    .optional(),
});

module.exports = async event => {
  // First, validate the incoming event body with Joi
  const { error, value } = topicValidationSchema.validate(
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
    db.collection('topics').insertOne(value); // Use validated value
    return {
      statusCode: 201,
      body: 'Document inserted successfully',
    };
  } catch (dbError) {
    console.error('Database Error:', dbError.message);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
