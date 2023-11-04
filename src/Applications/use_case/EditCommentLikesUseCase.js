class EditCommentLikesUseCase {
  constructor({ threadRepository, commentRepository, commentLikesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikesRepository = commentLikesRepository;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);

    const { threadId, commentId, userId } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository
      .verifyCommentAvailability(commentId);

    const commentLike = await this._commentLikesRepository
      .verifyCommentLikesOwner(commentId, userId);

    if (commentLike) {
      await this._commentLikesRepository.deleteCommentLike(commentId, userId);
    } else {
      await this._commentLikesRepository.addCommentLike(commentId, userId);
    }
  }

  verifyPayload(payload) {
    const { threadId, commentId, userId } = payload;

    if (!threadId || !commentId || !userId) {
      throw new Error('EDIT_COMMENT_LIKES_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('EDIT_COMMENT_LIKES_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = EditCommentLikesUseCase;
