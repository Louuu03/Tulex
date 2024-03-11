const createCategory = require('./createCategory');
const getCategories = require('./getCategories');
const updateCategory = require('./updateCategory');
const deleteCategory = require('./deleteCategory');

exports.handler = async event => {
  switch (event.httpMethod) {
    case 'POST':
      return createCategory(event);
    case 'GET':
      return getCategories(event);
    case 'PUT':
      return updateCategory(event);
    case 'DELETE':
      return deleteCategory(event);
    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};
