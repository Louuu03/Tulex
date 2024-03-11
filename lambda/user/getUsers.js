const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define the schema for ID validation
const pathParametersSchema = Joi.object({
  id: Joi.string()
    .optional()
    .custom((value, helpers) => {
      if (value && !ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value; // Keep the validated value if it's valid
    }, 'ObjectId validation'),
});

module.exports = async event => {
  const { db } = await connectToDatabase();

  try {
    // Extract the id from query parameters
    const { id } = event.queryStringParameters || {};

    // Validate the id (if provided) against the schema
    const { error, value } = pathParametersSchema.validate({ id });
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid ID format' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    let users;
    if (value.id) {
      // Fetch a single user if ID is provided and valid
      const userId = new ObjectId(value.id);
      users = await db.collection('users').findOne({ _id: userId });
      if (!users) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'User not found' }),
          headers: { 'Content-Type': 'application/json' },
        };
      }
    } else {
      // Fetch all users if no ID is provided
      users = await db.collection('users').find({}).toArray();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(users),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
