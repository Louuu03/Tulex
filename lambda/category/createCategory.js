const Joi = require('joi');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define Joi validation schema corresponding to the MongoDB schema
const categoryValidationSchema = Joi.object({
  name: Joi.string().required(),
  short: Joi.string().required(),
  long: Joi.string().required(),
  topics: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        topic_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')), // Validates if string is a valid MongoDB ObjectId
        create_time: Joi.date().required(),
      })
    )
    .required(),
  status: Joi.number().required(),
  language: Joi.array().items(Joi.number()).required(),
  subscribed: Joi.array()
    .items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')))
    .required(), // Array of strings that should be valid MongoDB ObjectIds
});

module.exports = async event => {
  // First, validate the incoming event body with Joi
  const { error, value } = categoryValidationSchema.validate(
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
    const result = await db.collection('categories').insertOne(value); // Use validated value
    return {
      statusCode: 201,
      body: JSON.stringify(result.ops[0]),
    };
  } catch (dbError) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
