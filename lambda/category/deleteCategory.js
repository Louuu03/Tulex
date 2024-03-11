const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

// Define Joi schema for validating pathParameters
const pathParametersSchema = Joi.object({
  id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(), // Validates if string is a valid MongoDB ObjectId
});

module.exports = async event => {
  // Validate the incoming pathParameters for a valid ObjectId
  const { error, value } = pathParametersSchema.validate(event.pathParameters);

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
    const categoryId = new ObjectId(value.id); // Use validated value
    const result = await db
      .collection('categories')
      .deleteOne({ _id: categoryId });

    if (result.deletedCount === 0) {
      return { statusCode: 404, body: 'Category not found' };
    }

    return {
      statusCode: 200,
      body: 'Category deleted successfully',
    };
  } catch (dbError) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
