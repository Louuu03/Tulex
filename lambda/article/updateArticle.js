const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('/opt/nodejs/mongodbClient');

const updateArticleSchema = Joi.object({
  user_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  category_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  topic_id: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).optional(),
  content: Joi.string().optional(),
  last_save: Joi.date().optional(),
  status: Joi.number().optional(),
  create_time: Joi.date().optional(),
  feedback: Joi.object({
    rating: Joi.number().optional(),
    comment: Joi.string().optional(),
    suggestion: Joi.string().optional(),
    article: Joi.string().optional(),
    highlights: Joi.array()
      .items(
        Joi.object({
          word: Joi.string().required(),
          explanation: Joi.string().required(),
        })
      )
      .optional(),
  }).optional(),
  language: Joi.number().optional(),
}).min(1); // Ensure at least one field is provided for update

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
  const bodyValidation = updateArticleSchema.validate(JSON.parse(event.body));
  if (bodyValidation.error) {
    return {
      statusCode: 400,
      body: `Validation Error: ${bodyValidation.error.details.map(x => x.message).join(', ')}`,
    };
  }

  const { db } = await connectToDatabase();
  const articleId = new ObjectId(pathValidation.value.id);
  const updates = bodyValidation.value;

  try {
    const result = await db
      .collection('articles')
      .updateOne({ _id: articleId }, { $set: updates });

    if (result.matchedCount === 0) {
      return { statusCode: 404, body: 'Article not found' };
    }

    return {
      statusCode: 200,
      body: 'Article updated successfully',
    };
  } catch (error) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
