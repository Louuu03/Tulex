const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Extended validation schema for query parameters
const queryParametersSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  user_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  category_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  status: Joi.number().optional(),
  language: Joi.alternatives()
    .try(Joi.number(), Joi.array().items(Joi.number()))
    .optional(),
  // Add more fields as necessary
}).optional();

module.exports = async event => {
  // Validate query parameters
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
    // Construct the query dynamically based on validated query parameters
    let query = {};
    if (queryParams.id) query._id = new ObjectId(queryParams.id);
    if (queryParams.user_id) query.user_id = new ObjectId(queryParams.user_id);
    if (queryParams.category_id)
      query.category_id = new ObjectId(queryParams.category_id);
    if (queryParams.status) query.status = queryParams.status;
    if (queryParams.language)
      query.language = Array.isArray(queryParams.language)
        ? { $in: queryParams.language }
        : queryParams.language;

    // Adjust the query execution based on whether a specific ID was provided
    let queryResult;
    if (queryParams.id) {
      queryResult = await db.collection('articles').findOne(query);
    } else {
      queryResult = await db.collection('articles').find(query).toArray();
    }

    // If querying a specific ID that doesn't exist, return a 404
    if (queryParams.id && !queryResult) {
      return {
        statusCode: 404,
        body: 'Article not found',
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(queryResult),
    };
  } catch (dbError) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
