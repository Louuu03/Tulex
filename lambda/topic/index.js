const createTopic = require('./createTopic');
const getTopics = require('./getTopics');
const updateTopic = require('./updateTopic');
const deleteTopic = require('./deleteTopic');

exports.handler = async event => {
  switch (event.httpMethod) {
    case 'POST':
      return createTopic(event);
    case 'GET':
      return getTopics(event);
    case 'PUT':
      return updateTopic(event);
    case 'DELETE':
      return deleteTopic(event);
    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};
