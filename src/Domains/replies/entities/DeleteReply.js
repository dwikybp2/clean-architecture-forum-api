class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.userId = payload.userId;
  }

  _verifyPayload(payload) {
    const { commentId, userId } = payload;

    if (!commentId || !userId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
