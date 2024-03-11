const Joi = require('joi');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

/**
 * Defines the schema for user validation using Joi.
 */
const userValidationSchema = Joi.object({
  plan: Joi.number().valid(0, 1, 2).required(),
  birthday: Joi.date().required(),
  categories: Joi.object({
    _id: Joi.string().required(),
    streak: Joi.number().required(),
  }).required(),
  country: Joi.number().required(),
  gender: Joi.number().valid(0, 1, 2, 3).required(),
  img: Joi.string().optional(),
  language: Joi.number().valid(0, 1, 2).required(),
  learning: Joi.object({
    writing: Joi.array()
      .items(Joi.number().valid(0, 1, 2))
      .required(),
    speaking: Joi.array()
      .items(Joi.number().valid(0, 1, 2))
      .required(),
  }).required(),
  name: Joi.string().required(),
});

module.exports = async event => {
  const { db } = await connectToDatabase();

  try {
    if (event.headers['Content-Type'] !== 'application/json') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid content type. Please use application/json',
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const userData = JSON.parse(event.body);
    const { error, value } = userValidationSchema.validate(userData);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(value);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'User created successfully',
        _id: result.insertedId,
      }),
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
