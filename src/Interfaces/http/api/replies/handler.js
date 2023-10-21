const autoBind = require('auto-bind');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const payload = {
      threadId,
      commentId,
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request) {
    const { commentId, replyId } = request.params;
    const payload = {
      replyId,
      commentId,
      userId: request.auth.credentials.id,
    };

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
