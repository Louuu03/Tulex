const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define Joi schema for validating the optional update fields
const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  plan: Joi.number().valid(0, 1, 2).optional(),
  birthday: Joi.date().iso().optional(),
  categories: Joi.object({
    _id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'ObjectId validation for category'),
    streak: Joi.number().integer().min(0).required(),
  }).optional(),
  country: Joi.number().integer().optional(),
  gender: Joi.number().valid(0, 1, 2, 3).optional(),
  img: Joi.string().uri().optional(),
  language: Joi.number().valid(0, 1, 2).optional(),
  learning: Joi.object({
    writing: Joi.array()
      .items(Joi.number().valid(0, 1, 2))
      .optional(),
    speaking: Joi.array()
      .items(Joi.number().valid(0, 1, 2))
      .optional(),
  }).optional(),
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
  const bodyValidation = updateUserSchema.validate(JSON.parse(event.body));
  if (bodyValidation.error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    };
  }

  const { db } = await connectToDatabase();
  const userId = new ObjectId(pathValidation.value.id);
  const updates = bodyValidation.value;

  try {
    const result = await db
      .collection('users')
      .updateOne({ _id: userId }, { $set: updates });

    if (result.matchedCount === 0) {
      return { statusCode: 404, body: 'User not found' };
    }

    return {
      statusCode: 200,
      body: 'User updated successfully',
    };
  } catch (error) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
