const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Extend the Joi schema to validate additional query parameters
const pathParametersSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  category_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  language: Joi.array().items(Joi.number()).single().optional(),
  level: Joi.array().items(Joi.number()).single().optional(),
  subscribed: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  endtime: Joi.date().optional(),
}).optional();

module.exports = async event => {
  // Validate the incoming query parameters
  const { error, value } = pathParametersSchema.validate(
    event.queryStringParameters || {}
  );

  // If validation fails, return an error response
  if (error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${error.details.map(x => x.message).join(', ')}`,
    };
  }

  const { db } = await connectToDatabase();

  try {
    // Construct a query object based on validated parameters
    let query = {};
    if (value.id) {
      query._id = new ObjectId(value.id);
    }
    if (value.category_id) {
      query.category_id = new ObjectId(value.category_id);
    }
    if (value.language) {
      query.language = { $in: value.language };
    }
    if (value.level) {
      query.level = { $in: value.level };
    }
    if (value.subscribed) {
      query.subscribed = new ObjectId(value.subscribed);
    }
    if (value.endtime) {
      query.endtime = { $lte: new Date(value.endtime) };
    }

    // Execute the query
    const queryResult = await db.collection('topics').find(query).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(queryResult),
    };
  } catch (dbError) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
