const autoBind = require('auto-bind');
const EditCommentLikesUseCase = require('../../../../Applications/use_case/EditCommentLikesUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async putCommentLikesHandler(request) {
    const { threadId, commentId } = request.params;
    const payload = {
      threadId,
      commentId,
      userId: request.auth.credentials.id,
    };

    const editCommentLikesUseCase = this._container.getInstance(EditCommentLikesUseCase.name);
    await editCommentLikesUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentLikesHandler;
