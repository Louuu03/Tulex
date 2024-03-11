const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Extended validation schema for query parameters
const queryParametersSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  language: Joi.alternatives()
    .try(Joi.number(), Joi.array().items(Joi.number()))
    .optional(),
  subscribed: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
}).optional();
module.exports = async event => {
  // Attempt to validate the incoming query parameters
  const { error, value: queryParams } = queryParametersSchema.validate(
    event.queryStringParameters || {}
  );

  if (error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${error.details.map(x => x.message).join(', ')}`,
    };
  }

  const { db } = await connectToDatabase();

  try {
    let query = {};
    if (queryParams.id) query._id = new ObjectId(queryParams.id);
    if (queryParams.language)
      query.language = Array.isArray(queryParams.language)
        ? { $in: queryParams.language }
        : queryParams.language;
    if (queryParams.subscribed)
      query.subscribed = new ObjectId(queryParams.subscribed);

    let queryResult;
    if (queryParams.id) {
      queryResult = await db.collection('categories').findOne(query);
    } else {
      queryResult = await db.collection('categories').find(query).toArray();
    }

    if (queryParams.id && !queryResult) {
      return {
        statusCode: 404,
        body: 'Category not found',
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(queryResult),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
