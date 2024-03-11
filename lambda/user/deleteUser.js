const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Joi schema for ID validation
const pathParametersSchema = Joi.object({
  id: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value; // Keep the validated value if it's valid
    }, 'ObjectId validation'),
});

module.exports = async event => {
  const { db } = await connectToDatabase();

  try {
    const userId = event.pathParameters.id;

    // Validate the userId with the defined schema
    const { error } = pathParametersSchema.validate({ id: userId });
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid user ID' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const usersCollection = db.collection('users');
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
