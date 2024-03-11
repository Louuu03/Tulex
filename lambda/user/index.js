const getUsers = require('./getUsers');
const updateUser = require('./updateUser');
const deleteUser = require('./deleteUser');
const createUser = require('./createUser');

exports.handler = async event => {
  switch (event.httpMethod) {
    case 'POST':
      return createUser(event);
    case 'GET':
      return getUsers(event);
    case 'PUT':
      return updateUser(event);
    case 'DELETE':
      return deleteUser(event);
    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};
