const CommentLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'commentLikes',
  register: async (server, { container }) => {
    const commentLIkesHandler = new CommentLikesHandler(container);
    server.route(routes(commentLIkesHandler));
  },
};
