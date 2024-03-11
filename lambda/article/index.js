const createArticle = require('./createArticle');
const getArticles = require('./getArticles');
const updateArticle = require('./updateArticle');
const deleteArticle = require('./deleteArticle');

exports.handler = async event => {
  switch (event.httpMethod) {
    case 'POST':
      return createArticle(event);
    case 'GET':
      return getArticles(event);
    case 'PUT':
      return updateArticle(event);
    case 'DELETE':
      return deleteArticle(event);
    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};
